import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { BASE_URL } from '@/lib/apiClient';

const CartPage = () => {
  const { cartItems, subtotal, removeItem, updateQuantity, isLoading } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild className="bg-gradient-gold text-secondary rounded-full">
              <Link to="/idols">Browse Idols</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;
                const imageUrl = product.images?.[0]?.image_url
                  ? `${BASE_URL}/${product.images[0].image_url.replace(/\\/g, '/')}`
                  : '/placeholder.jpg';
                  
                return (
                  <div key={item.id} className="flex gap-4 bg-card border border-border rounded-xl p-4">
                    <Link to={`/idols/${product.slug}`} className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/idols/${product.slug}`} className="font-display font-semibold text-foreground hover:text-primary line-clamp-1">
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{product.material || 'Mixed'}</p>
                      <p className="text-lg font-bold text-foreground mt-1">₹{(Number(item.price_at_add) * item.quantity).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center border border-border rounded-lg">
                        <button onClick={() => updateQuantity({ cart_id: item.id, quantity: item.quantity - 1 })} className="p-1.5 hover:bg-muted transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity({ cart_id: item.id, quantity: item.quantity + 1 })} className="p-1.5 hover:bg-muted transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-card border border-border rounded-xl p-6 h-fit sticky top-24">
              <h3 className="font-display font-semibold text-lg text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{Number(subtotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-foreground border-t border-border pt-4 mb-6">
                <span>Total</span>
                <span>₹{Number(subtotal).toLocaleString()}</span>
              </div>
              <Button asChild className="w-full bg-gradient-gold text-secondary font-semibold rounded-full hover:opacity-90">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
