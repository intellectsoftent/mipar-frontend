import { Link } from 'react-router-dom';
import { Sparkles, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

const HeroSection = () => (
  <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBanner} alt="Sacred temple with divine idols" className="w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
    </div>
    <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
      <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-5 py-2 mb-6">
        <Sparkles className="w-4 h-4 text-gold" />
        <span className="text-sm font-medium text-gold">Trusted by 5,000+ Families</span>
      </div>
      <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
        <span className="text-white">Sacred </span>
        <span className="text-gradient-gold">Idols & Murtis</span>
        <br />
        <span className="text-white">At Your Doorstep</span>
      </h2>
      <p className="text-white/80 text-lg md:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
        Handcrafted brass idols blessed by priests, delivered to your doorstep with divine care.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button asChild size="lg" className="bg-gradient-gold text-secondary font-semibold px-8 py-6 text-base rounded-full hover:opacity-90 transition-opacity shadow-lg">
          <Link to="/idols">
            <Sparkles className="w-5 h-5 mr-2" /> Explore Idols
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="border-white/30 text-white bg-white/10 backdrop-blur-sm px-8 py-6 text-base rounded-full hover:bg-white/20">
          <a href="tel:+918309326395">
            <Phone className="w-5 h-5 mr-2" /> Call Now
          </a>
        </Button>
      </div>
      <div className="flex items-center justify-center gap-8 mt-12">
        {[
          { num: '500+', label: 'Idols Sold' },
          { num: '50+', label: 'Deity Types' },
          { num: '20+', label: 'Cities Covered' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-bold text-gradient-gold">{s.num}</p>
            <p className="text-xs text-white/60 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
