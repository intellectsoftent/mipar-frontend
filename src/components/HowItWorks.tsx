const STEPS = [
  { num: '1', title: 'Choose Your Idol', desc: 'Browse our curated collection of sacred brass, bronze and marble idols.' },
  { num: '2', title: 'Place Your Order', desc: 'Add to cart, fill in your details and confirm your booking.' },
  { num: '3', title: 'Blessed & Packed', desc: 'Each idol is blessed by priests and securely packed for delivery.' },
  { num: '4', title: 'Delivered with Care', desc: 'Receive your sacred idol at your doorstep with divine blessings.' },
];

const HowItWorks = () => (
  <section className="py-16 bg-muted/50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <p className="text-sm text-muted-foreground font-medium mb-2">Simple Process</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {STEPS.map((step) => (
          <div key={step.num} className="text-center">
            <div className="w-12 h-12 rounded-full bg-gradient-gold text-secondary font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-md">
              {step.num}
            </div>
            <h3 className="font-display font-semibold text-foreground text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
