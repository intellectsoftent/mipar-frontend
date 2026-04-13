import { useState } from 'react';
import { toast } from 'sonner';
import { useAdminOrders, useUpdateOrderStatus, useDashboardStats } from '@/hooks/useOrders';
import {
  ShoppingBag, Clock, CheckCircle, Truck, Package, XCircle,
  Loader2, Search, TrendingUp, Users, IndianRupee, RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BASE_URL } from '@/lib/apiClient';

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; className: string }> = {
  pending:          { label: 'Pending',          icon: Clock,        className: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20' },
  confirmed:        { label: 'Confirmed',        icon: CheckCircle,  className: 'bg-blue-500/10 text-blue-700 border-blue-500/20' },
  processing:       { label: 'Processing',       icon: Package,      className: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20' },
  shipped:          { label: 'Shipped',          icon: Truck,        className: 'bg-purple-500/10 text-purple-700 border-purple-500/20' },
  out_for_delivery: { label: 'Out for Delivery', icon: Truck,        className: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/20' },
  delivered:        { label: 'Delivered',        icon: CheckCircle,  className: 'bg-green-500/10 text-green-700 border-green-500/20' },
  cancelled:        { label: 'Cancelled',        icon: XCircle,      className: 'bg-red-500/10 text-red-700 border-red-500/20' },
  refunded:         { label: 'Refunded',         icon: RefreshCw,    className: 'bg-orange-500/10 text-orange-700 border-orange-500/20' },
};

const FILTER_STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: orders = [], isLoading, refetch } = useAdminOrders({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: search || undefined,
  });

  const { data: stats } = useDashboardStats();
  const updateStatus = useUpdateOrderStatus();

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Order status updated to "${STATUS_CONFIG[status]?.label || status}"`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Dashboard Summary Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total_orders}</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pending_orders}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">₹{Number(stats.total_revenue || 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.total_customers}</p>
              <p className="text-xs text-muted-foreground">Customers</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search order # or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background border-border text-muted-foreground hover:border-primary/50'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground">
            No orders {statusFilter !== 'all' ? `with "${STATUS_CONFIG[statusFilter]?.label}" status` : 'yet'}
          </p>
          <p className="text-muted-foreground text-sm mt-1">Orders from customers will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG['pending'];
            const StatusIcon = config.icon;
            return (
              <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl border ${config.className}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm font-mono">#{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Payment badge — derived: COD + delivered = Paid */}
                    {(() => {
                      const isCodDelivered = order.payment_method === 'cod' && order.status === 'delivered';
                      const effectiveStatus = isCodDelivered ? 'paid' : order.payment_status;
                      const isPaid = effectiveStatus === 'paid';
                      return (
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          isPaid ? 'bg-green-500/10 text-green-700 border-green-500/20' : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
                        }`}>
                          {order.payment_method?.toUpperCase()} · {effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
                        </span>
                      );
                    })()}

                    {/* Quick-action buttons for pending orders */}
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          disabled={updateStatus.isPending}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          disabled={updateStatus.isPending}
                          className="flex items-center gap-1.5 text-xs font-semibold bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </>
                    )}

                    {/* Full status dropdown for all statuses */}
                    <select
                      value={order.status}
                      disabled={updateStatus.isPending}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-sm border border-border rounded-xl px-3 py-2 bg-background text-foreground font-medium cursor-pointer disabled:opacity-50"
                    >
                      {Object.keys(STATUS_CONFIG).map((s) => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
                    {/* Customer Info */}
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Customer</p>
                      <p className="font-semibold text-foreground text-sm">{order.user?.name || order.shipping_name}</p>
                      <p className="text-xs text-muted-foreground">{order.user?.email || '—'}</p>
                      <p className="text-xs text-muted-foreground">{order.shipping_phone}</p>
                    </div>
                    {/* Shipping Address */}
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Shipping Address</p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {order.shipping_address_line1}
                        {order.shipping_address_line2 && `, ${order.shipping_address_line2}`}
                        <br />
                        {order.shipping_city}, {order.shipping_state} – {order.shipping_pincode}
                      </p>
                    </div>
                    {/* Amount */}
                    <div className="space-y-1 md:text-right">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Total Amount</p>
                      <p className="text-2xl font-bold text-foreground">₹{Number(order.total_amount).toLocaleString()}</p>
                      {Number(order.discount_amount) > 0 && (
                        <p className="text-xs text-green-600">−₹{Number(order.discount_amount).toLocaleString()} discount</p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  {order.items && order.items.length > 0 && (
                    <div className="bg-muted/30 rounded-xl p-4">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-3">
                        Items ({order.items.length})
                      </p>
                      <div className="space-y-3">
                        {order.items.map((item, i) => {
                          const imgUrl = item.product_image
                            ? `${BASE_URL}/${item.product_image.replace(/\\/g, '/')}`
                            : '/placeholder.jpg';
                          return (
                            <div key={i} className="flex items-center gap-4">
                              <img
                                src={imgUrl}
                                alt={item.product_name}
                                className="w-12 h-12 rounded-xl object-cover bg-muted border border-border"
                                onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{item.product_name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-foreground text-sm shrink-0">
                                ₹{Number(item.total_price).toLocaleString()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
