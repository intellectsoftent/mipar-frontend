import { useState, useMemo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { useIdols } from '@/hooks/useIdols';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IdolCard from '@/components/IdolCard';
import { Input } from '@/components/ui/input';

const CATEGORIES = ['All', 'Ganesha', 'Lakshmi', 'Shiva', 'Krishna', 'Hanuman', 'Saraswati', 'Durga', 'Vishnu'];
const MATERIALS = ['All Materials', 'Pure Brass', 'Bronze', 'Marble', 'Copper', 'Panchaloha'];

const IdolsPage = () => {
  const { data: idols, isLoading } = useIdols();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [material, setMaterial] = useState('All Materials');

  const filtered = useMemo(() => {
    if (!idols) return [];
    return idols.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || (i.category?.name || i.deity || '').toLowerCase().includes(category.toLowerCase());
      const matchMat = material === 'All Materials' || i.material === material;
      return matchSearch && matchCat && matchMat;
    });
  }, [idols, search, category, material]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative py-16 bg-gradient-warm text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold">
          <span className="text-secondary-foreground">Sacred </span>
          <span className="text-gradient-gold">Idols & Murtis</span>
        </h1>
        <p className="text-secondary-foreground/70 mt-3">Handcrafted brass idols blessed by priests, delivered to your doorstep</p>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search idols..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="border border-border rounded-lg px-4 py-2 text-sm bg-background text-foreground"
          >
            {MATERIALS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                category === c
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((idol) => (
              <IdolCard key={idol.id} idol={idol} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No idols found matching your criteria.</p>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default IdolsPage;
