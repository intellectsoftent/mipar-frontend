import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ChevronLeft, ZoomIn, X, Loader2 } from 'lucide-react';
import { useIdol } from '@/hooks/useIdols';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { BASE_URL } from '@/lib/apiClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const IdolDetailPage = () => {
  const { id } = useParams();
  const { data: idol, isLoading } = useIdol(id || '');
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart', {
        action: { label: 'Sign In', onClick: () => window.location.href = '/login' },
      });
      return;
    }
    setAdding(true);
    try {
      await addToCart({ product_id: Number(idol!.id), quantity });
      toast.success(`${idol!.name} added to cart! 🛒`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center py-32">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!idol) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-xl text-muted-foreground mb-4">Idol not found</p>
          <Link to="/idols" className="text-primary hover:underline">← Back to Idols</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentPrice = idol.sale_price ? Number(idol.sale_price) : Number(idol.price);
  const originalPriceNumber = idol.sale_price ? Number(idol.price) : null;
  
  const discount = originalPriceNumber
    ? Math.round(((originalPriceNumber - currentPrice) / originalPriceNumber) * 100)
    : 0;

  const images = idol.images && idol.images.length > 0
    ? idol.images.map(img => `${BASE_URL}/${img.image_url.replace(/\\/g, '/')}`)
    : ['/placeholder.jpg'];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/idols" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Idols
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Images */}
          <div>
            <div
              className="relative aspect-square bg-muted rounded-xl overflow-hidden cursor-zoom-in group"
              onClick={() => setZoomed(true)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={images[selectedImage]}
                alt={idol.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                style={zoomed ? {} : { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }}
                onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
              />
              <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5 text-foreground" />
              </div>
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">{idol.name}</h1>
            <p className="text-muted-foreground mt-2">{idol.material || 'Mixed'} · {idol.dimensions || 'Standard size'}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(idol.rating_avg || 0) ? 'fill-gold text-gold' : 'text-muted'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{Number(idol.rating_avg || 0).toFixed(1)}</span>
            </div>

            <div className="flex items-baseline gap-3 mt-6">
              <span className="text-3xl font-bold text-foreground">₹{currentPrice.toLocaleString()}</span>
              {originalPriceNumber && (
                <span className="text-lg text-muted-foreground line-through">₹{originalPriceNumber.toLocaleString()}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-medium text-primary">Save {discount}%</span>
              )}
            </div>

            <p className="text-muted-foreground mt-6 leading-relaxed whitespace-pre-wrap">{idol.description}</p>

            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-foreground hover:bg-muted transition-colors">−</button>
                <span className="px-4 py-2 font-medium text-foreground border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-foreground hover:bg-muted transition-colors">+</button>
              </div>
              <Button
                size="lg"
                disabled={adding}
                className="flex-1 bg-gradient-gold text-secondary font-semibold rounded-full hover:opacity-90 disabled:opacity-60"
                onClick={handleAddToCart}
              >
                {adding
                  ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Adding...</>
                  : <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>
                }
              </Button>
            </div>

            <div className="mt-8 space-y-3 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">✓ Blessed by priests before dispatch</p>
              <p className="text-sm text-muted-foreground">✓ Secure packaging with insurance</p>
              <p className="text-sm text-muted-foreground">✓ Free delivery across India</p>
              <p className="text-sm text-muted-foreground">✓ Cash on Delivery available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomed && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setZoomed(false)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[selectedImage]}
            alt={idol.name}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => { e.currentTarget.src = '/placeholder.jpg'; }}
          />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default IdolDetailPage;
