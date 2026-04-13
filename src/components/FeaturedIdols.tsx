import { Link } from 'react-router-dom';
import { useIdols } from '@/hooks/useIdols';
import IdolCard from './IdolCard';
import { Sparkles, Loader2 } from 'lucide-react';

const FeaturedIdols = () => {
  const { data: idols, isLoading } = useIdols();
  
  const featured = idols 
    ? idols.filter((i) => i.is_featured).slice(0, 4)
    : [];

  return (
    <section className="py-16 bg-background" id="idols">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm text-primary font-medium flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" /> Curated for You <Sparkles className="w-4 h-4" />
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Featured Idols</h2>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((idol) => (
              <IdolCard key={idol.id} idol={idol} />
            ))}
            {featured.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground py-8">No featured idols currently available.</p>
            )}
          </div>
        )}
        
        <div className="text-center mt-10">
          <Link to="/idols" className="inline-flex items-center gap-2 bg-gradient-gold text-secondary font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity shadow-md">
            View All Idols
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedIdols;
