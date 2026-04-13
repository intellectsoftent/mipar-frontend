import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Priya Sharma', location: 'Mumbai', text: 'The Ganesha idol is absolutely stunning. The brass work is exquisite and it arrived beautifully packed. Very happy with my purchase!', rating: 5 },
  { name: 'Rajesh Kumar', location: 'Hyderabad', text: 'Excellent quality idols at reasonable prices. The delivery was on time and the idol was exactly as shown in the pictures.', rating: 5 },
  { name: 'Anita Reddy', location: 'Chennai', text: 'I ordered a Lakshmi idol and it exceeded my expectations. The craftsmanship is remarkable. Will definitely order again!', rating: 5 },
];

const Testimonials = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <p className="text-sm text-muted-foreground font-medium mb-2">Speaking From Their Hearts</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Testimonials</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REVIEWS.map((r) => (
          <div key={r.name} className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{r.text}"</p>
            <div>
              <p className="font-semibold text-foreground text-sm">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
