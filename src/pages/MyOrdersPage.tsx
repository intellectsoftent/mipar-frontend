import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrders, useCancelOrder } from '@/hooks/useOrders';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BASE_URL } from '@/lib/apiClient';
import { toast } from 'sonner';
import {
  ShoppingBag, Clock, CheckCircle, Truck, Package, XCircle,
  Loader2, ChevronDown, ChevronUp, MapPin, Phone, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending:          { label: 'Pending',          icon: Clock,        color: 'text-yellow-700',  bg: 'bg-yellow-50 border-yellow-200' },
  confirmed:        { label: 'Confirmed',        icon: CheckCircle,  color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200' },
  processing:       { label: 'Processing',       icon: Package,      color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200' },
  shipped:          { label: 'Shipped',          icon: Truck,        color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200' },
  out_for_delivery: { label: 'Out for Delivery', icon: Truck,        color: 'text-cyan-700',    bg: 'bg-cyan-50 border-cyan-200' },
  delivered:        { label: 'Delivered',        icon: CheckCircle,  color: 'text-green-700',   bg: 'bg-green-50 border-green-200' },
  cancelled:        { label: 'Cancelled',        icon: XCircle,      color: 'text-red-700',     bg: 'bg-red-50 border-red-200' },
  refunded:         { label: 'Refunded',         icon: RefreshCw,    color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200' },
};

const PROGRESS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const OrderCard = ({ order }: { order: any }) => {
  const [expanded, setExpanded] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const cancelMutation = useCancelOrder();

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
  const StatusIcon = cfg.icon;
  const canCancel = ['pending', 'confirmed'].includes(order.status);
  const progressIdx = PROGRESS_STEPS.indexOf(order.status);

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ id: order.id });
      toast.success('Order cancelled successfully. Stock has been restored.');
      setCancelConfirm(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel order');
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${cfg.bg}`}>
            <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm font-mono">#{order.order_number}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
          <span className="text-lg font-bold text-foreground">
            ₹{Number(order.total_amount).toLocaleString()}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {expanded ? 'Hide details' : 'View details'}
          </button>
        </div>
      </div>

      {/* Progress tracker — only for non-cancelled orders */}
      {order.status !== 'cancelled' && order.status !== 'refunded' && progressIdx !== -1 && (
        <div className="px-5 py-4 bg-muted/20 border-b border-border">
          <div className="flex items-center gap-0">
            {PROGRESS_STEPS.map((step, i) => {
              const stepCfg = STATUS_CONFIG[step];
              const StepIcon = stepCfg.icon;
              const done = i < progressIdx;
              const current = i === progressIdx;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className={`flex flex-col items-center gap-1 ${i === PROGRESS_STEPS.length -1 ? '' : 'flex-1'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${
                      done ? 'bg-primary border-primary' :
                      current ? 'bg-primary/10 border-primary' :
                      'bg-muted border-border'
                    }`}>
                      <StepIcon className={`w-3.5 h-3.5 ${
                        done ? 'text-white' :
                        current ? 'text-primary' :
                        'text-muted-foreground'
                      }`} />
                    </div>
                    <span className={`text-[9px] font-medium capitalize hidden sm:block ${current ? 'text-primary' : done ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stepCfg.label}
                    </span>
                  </div>
                  {i < PROGRESS_STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 rounded ${i < progressIdx ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expandable Details */}
      {expanded && (
        <div className="p-5 space-y-5">
          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Order Items ({order.items.length})
              </p>
              <div className="space-y-3">
                {order.items.map((item: any, i: number) => {
                  const imgUrl = item.product_image
                    ? `${BASE_URL}/${item.product_image.replace(/\\/g, '/')}`
                    : '/placeholder.jpg';
                  return (
                    <div key={i} className="flex items-center gap-4 bg-muted/30 rounded-xl p-3">
                      <img
                        src={imgUrl}
                        alt={item.product_name}
                        className="w-14 h-14 rounded-lg object-cover bg-muted border border-border shrink-0"
                        onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity} × ₹{Number(item.unit_price).toLocaleString()}</p>
                      </div>
                      <p className="font-bold text-foreground text-sm shrink-0">
                        ₹{Number(item.total_price).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price breakdown */}
          <div className="bg-muted/30 rounded-xl p-4 text-sm space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Price Breakdown</p>
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span>₹{Number(order.subtotal || order.total_amount).toLocaleString()}</span>
            </div>
            {Number(order.discount_amount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span><span>−₹{Number(order.discount_amount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{Number(order.shipping_amount) === 0 ? <span className="text-primary font-medium">Free</span> : `₹${Number(order.shipping_amount).toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-bold text-foreground border-t border-border pt-2 mt-2">
              <span>Total</span><span>₹{Number(order.total_amount).toLocaleString()}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-muted/30 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Shipping Address
            </p>
            <p className="text-sm font-semibold text-foreground">{order.shipping_name}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3" /> {order.shipping_phone}
            </p>
            <p className="text-sm text-foreground mt-1">
              {order.shipping_address_line1}
              {order.shipping_address_line2 && `, ${order.shipping_address_line2}`}<br />
              {order.shipping_city}, {order.shipping_state} – {order.shipping_pincode}
            </p>
          </div>

          {/* Payment info — derived smartly: COD delivered = paid */}
          {(() => {
            const isCodDelivered = order.payment_method === 'cod' && order.status === 'delivered';
            const effectiveStatus = isCodDelivered ? 'paid' : order.payment_status;
            const isPaid = effectiveStatus === 'paid';
            return (
              <div className="flex flex-wrap gap-3 text-sm">
                <span className={`px-3 py-1.5 rounded-lg border font-medium text-xs ${
                  isPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                }`}>
                  {order.payment_method?.toUpperCase()} · {effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
                </span>
                {order.cancelled_reason && (
                  <span className="text-xs text-destructive bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-lg">
                    Reason: {order.cancelled_reason}
                  </span>
                )}
              </div>
            );
          })()}

          {/* Cancel button */}
          {canCancel && (
            <div className="pt-2 border-t border-border">
              {cancelConfirm ? (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground flex-1">Are you sure you want to cancel this order?</p>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={cancelMutation.isPending}
                    onClick={handleCancel}
                    className="rounded-lg"
                  >
                    {cancelMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Cancel'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setCancelConfirm(false)} className="rounded-lg">
                    No, Keep
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCancelConfirm(true)}
                  className="rounded-lg text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <XCircle className="w-4 h-4 mr-1.5" /> Cancel Order
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MyOrdersPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { orders, isLoading } = useOrders();

  if (!authLoading && !user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-1 max-w-3xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">My Orders</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? 'Loading your orders...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-16 text-center">
            <ShoppingBag className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">No orders yet</p>
            <p className="text-muted-foreground text-sm mt-1 mb-6">Start shopping and your orders will appear here</p>
            <Button asChild className="bg-gradient-gold text-secondary rounded-full font-semibold">
              <Link to="/idols">Browse Idols</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyOrdersPage;
