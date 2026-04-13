import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { fetchApi } from '@/lib/apiClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Loader2, Package, Banknote, CreditCard, X,
  ShieldCheck, Truck, CheckCircle
} from 'lucide-react';

// ─── Load Razorpay script lazily ────────────────────────────────
const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

// ─── Payment Method Modal ────────────────────────────────────────
interface PaymentModalProps {
  total: number;
  onSelect: (method: 'cod' | 'razorpay') => void;
  onClose: () => void;
  isProcessing: boolean;
}

const PaymentModal = ({ total, onSelect, onClose, isProcessing }: PaymentModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div
      className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Choose Payment Method</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Pay <span className="font-bold text-foreground">₹{Number(total).toLocaleString()}</span> for your order
          </p>
        </div>
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Options */}
      <div className="p-6 space-y-3">
        {/* Razorpay Online Payment */}
        <button
          onClick={() => onSelect('razorpay')}
          disabled={isProcessing}
          className="w-full group flex items-center gap-4 p-5 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">Pay Online</p>
            <p className="text-xs text-muted-foreground mt-0.5">UPI · Cards · Net Banking · Wallets</p>
          </div>
          <div className="shrink-0">
            {isProcessing
              ? <Loader2 className="w-5 h-5 animate-spin text-primary" />
              : <div className="w-2 h-2 rounded-full bg-primary" />
            }
          </div>
        </button>

        {/* COD */}
        <button
          onClick={() => onSelect('cod')}
          disabled={isProcessing}
          className="w-full group flex items-center gap-4 p-5 rounded-xl border-2 border-border hover:border-primary/40 hover:bg-muted/50 transition-all text-left disabled:opacity-50"
        >
          <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors">
            <Banknote className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground">Cash on Delivery</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pay in cash when your order arrives</p>
          </div>
          <Truck className="w-5 h-5 text-muted-foreground shrink-0" />
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
        <span>Secure checkout · Your data is encrypted · 100% safe</span>
      </div>
    </div>
  </div>
);

// ─── Main CheckoutPage ────────────────────────────────────────────
const CheckoutPage = () => {
  const { cartItems, subtotal } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<Record<string, any> | null>(null);

  const [form, setForm] = useState({
    shipping_name: '',
    email: '',
    shipping_phone: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_pincode: '',
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        shipping_name: user.name || prev.shipping_name,
        email: user.email || prev.email,
        shipping_phone: user.phone || prev.shipping_phone,
      }));
    }
  }, [user]);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
  });

  // Step 1 — Validate form and open payment modal
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { shipping_name, shipping_phone, shipping_address_line1, shipping_city, shipping_state, shipping_pincode } = form;
    if (!shipping_name || !shipping_phone || !shipping_address_line1 || !shipping_city || !shipping_state || !shipping_pincode) {
      toast.error('Please fill all required fields');
      return;
    }
    const basePayload = {
      shipping_name: form.shipping_name,
      shipping_phone: form.shipping_phone,
      shipping_address_line1: form.shipping_address_line1,
      shipping_address_line2: form.shipping_address_line2 || undefined,
      shipping_city: form.shipping_city,
      shipping_state: form.shipping_state,
      shipping_pincode: form.shipping_pincode,
      shipping_country: 'India',
    };
    setPendingFormData(basePayload);
    setShowPaymentModal(true);
  };

  // Step 2a — COD
  const handleCOD = useCallback(async () => {
    if (!pendingFormData) return;
    setIsProcessing(true);
    try {
      await createOrder({ ...pendingFormData, payment_method: 'cod' } as any);
      setShowPaymentModal(false);
      toast.success('Order placed! Our team will confirm shortly. 📦');
      navigate('/my-orders');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to place order.');
    } finally {
      setIsProcessing(false);
    }
  }, [pendingFormData, createOrder, navigate]);

  // Step 2b — Razorpay
  const handleRazorpay = useCallback(async () => {
    if (!pendingFormData) return;
    setIsProcessing(true);

    try {
      // 1. Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast.error('Failed to load Razorpay. Check your internet connection.');
        setIsProcessing(false);
        return;
      }

      // 2. Create app order with payment_method = razorpay
      const orderRes: any = await createOrder({ ...pendingFormData, payment_method: 'razorpay' } as any);
      const appOrderId: number = orderRes?.data?.id;
      if (!appOrderId) throw new Error('Could not create order.');

      // 3. Create Razorpay payment order
      const rpRes: any = await fetchApi<any>('/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ order_id: appOrderId }),
      });
      const rpData = rpRes.data;

      // 4. Open Razorpay checkout popup
      const options: any = {
        key: rpData.key_id,
        amount: rpData.amount,
        currency: rpData.currency,
        name: 'MIPAR Sacred Idols',
        description: `Order #${rpData.order_number}`,
        image: '/favicon.ico',
        order_id: rpData.razorpay_order_id,
        prefill: {
          name: rpData.prefill?.name || form.shipping_name,
          contact: rpData.prefill?.contact || form.shipping_phone,
          email: form.email,
        },
        theme: { color: '#b45309' },
        handler: async (response: any) => {
          // 5. Verify payment signature
          try {
            await fetchApi('/payments/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: appOrderId,
              }),
            });
            setShowPaymentModal(false);
            toast.success('Payment successful! Order confirmed. 🎉');
            navigate('/my-orders');
          } catch (verifyErr: any) {
            toast.error(verifyErr?.message || 'Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment was cancelled. Your order has been placed — you can retry payment from My Orders.');
            setShowPaymentModal(false);
            navigate('/my-orders');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [pendingFormData, createOrder, navigate, form.email, form.shipping_name, form.shipping_phone]);

  const handlePaymentSelect = (method: 'cod' | 'razorpay') => {
    if (method === 'cod') handleCOD();
    else handleRazorpay();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1 max-w-5xl">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg text-foreground">Contact Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name *</Label>
                  <Input {...field('shipping_name')} placeholder="Ramesh Kumar" required className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone *</Label>
                  <Input {...field('shipping_phone')} type="tel" placeholder="+91 98765 43210" required className="h-11" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Email</Label>
                  <Input {...field('email')} type="email" placeholder="your@email.com" className="h-11" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="font-display font-semibold text-lg text-foreground">Shipping Address</h3>
              <div className="space-y-1.5">
                <Label>Address Line 1 *</Label>
                <Input {...field('shipping_address_line1')} placeholder="House No., Street, Area" required className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Address Line 2</Label>
                <Input {...field('shipping_address_line2')} placeholder="Landmark, Apartment (optional)" className="h-11" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Input {...field('shipping_city')} placeholder="Mumbai" required className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label>State *</Label>
                  <Input {...field('shipping_state')} placeholder="Maharashtra" required className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label>PIN Code *</Label>
                  <Input {...field('shipping_pincode')} placeholder="400001" required maxLength={6} className="h-11" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-gold text-secondary font-semibold py-6 rounded-full hover:opacity-90 text-lg"
            >
              Continue to Payment →
            </Button>
          </form>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
            <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Order Summary
            </h3>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start text-sm gap-2">
                  <span className="text-muted-foreground line-clamp-2 flex-1">{item.product?.name} × {item.quantity}</span>
                  <span className="text-foreground font-medium shrink-0">₹{(Number(item.price_at_add) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{Number(subtotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className="text-primary font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-base border-t border-border pt-3 mt-2">
                <span>Total</span>
                <span>₹{Number(subtotal).toLocaleString()}</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-5 pt-4 border-t border-border space-y-2.5">
              {[
                { icon: ShieldCheck, text: 'Secure 256-bit SSL encryption' },
                { icon: Truck, text: 'Free delivery across India' },
                { icon: CheckCircle, text: 'Blessed by priests before dispatch' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Icon className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Payment methods preview */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Accepted payments</p>
              <div className="flex flex-wrap gap-1.5">
                {['UPI', 'Visa', 'Mastercard', 'Net Banking', 'COD'].map((m) => (
                  <span key={m} className="text-[10px] font-medium bg-muted px-2 py-1 rounded border border-border text-muted-foreground">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <PaymentModal
          total={Number(subtotal)}
          onSelect={handlePaymentSelect}
          onClose={() => { if (!isProcessing) setShowPaymentModal(false); }}
          isProcessing={isProcessing}
        />
      )}

      <Footer />
    </div>
  );
};

export default CheckoutPage;
