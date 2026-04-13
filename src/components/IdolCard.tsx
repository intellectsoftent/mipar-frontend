import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Loader2 } from 'lucide-react';
import type { Idol } from '@/types/idol';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BASE_URL } from '@/lib/apiClient';

const IdolCard = ({ idol }: { idol: Idol }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  const currentPrice = idol.sale_price ? Number(idol.sale_price) : Number(idol.price);
  const originalPriceNumber = idol.sale_price ? Number(idol.price) : null;

  const discount = originalPriceNumber
    ? Math.round(((originalPriceNumber - currentPrice) / originalPriceNumber) * 100)
    : 0;

  const imageUrl = idol.images && idol.images.length > 0
    ? `${BASE_URL}/${idol.images[0].image_url.replace(/\\/g, '/')}`
    : '/placeholder.jpg';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to add items to cart', {
        action: { label: 'Sign In', onClick: () => window.location.href = '/login' },
      });
      return;
    }
    setAdding(true);
    try {
      await addToCart({ product_id: Number(idol.id), quantity: 1 });
      toast.success(`${idol.name} added to cart! 🛒`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
      <Link to={`/idols/${idol.slug}`} className="block relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={idol.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/idols/${idol.slug}`}>
          <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {idol.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">
          {idol.material || 'Mixed Material'} · {idol.dimensions || 'Standard'}
        </p>
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-3.5 h-3.5 fill-gold text-gold" />
          <span className="text-sm font-medium text-foreground">{Number(idol.rating_avg || 0).toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">₹{currentPrice.toLocaleString()}</span>
            {originalPriceNumber && (
              <span className="text-sm text-muted-foreground line-through">₹{originalPriceNumber.toLocaleString()}</span>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            disabled={adding}
            className="rounded-full border-primary/30 hover:bg-primary hover:text-primary-foreground"
            onClick={handleAddToCart}
          >
            {adding
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <ShoppingCart className="w-4 h-4" />
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdolCard;
