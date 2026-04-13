import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import mandalaPattern from '@/assets/mandala-pattern.jpg';

const CTASection = () => (
  <section className="relative py-20 overflow-hidden">
    <div className="absolute inset-0">
      <img src={mandalaPattern} alt="" className="w-full h-full object-cover" loading="lazy" width={1920} height={512} />
      <div className="absolute inset-0 bg-black/50" />
    </div>
    <div className="relative z-10 text-center px-4">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
        Ready to Bring Divine Blessings Home?
      </h2>
      <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
        Order your sacred idol today and experience the serenity of authentic craftsmanship.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/idols"
          className="inline-flex items-center gap-2 bg-gradient-gold text-secondary font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity shadow-lg"
        >
          Browse Idols
        </Link>
        <a
          href="tel:+918309326395"
          className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <Phone className="w-4 h-4" /> +91 8309 326 395
        </a>
      </div>
    </div>
  </section>
);

export default CTASection;
