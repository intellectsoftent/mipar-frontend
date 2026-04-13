import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🙏</span>
            <h3 className="font-display text-xl font-bold">MIPAR</h3>
          </div>
          <p className="text-secondary-foreground/70 text-sm leading-relaxed">
            Handcrafted sacred idols blessed by priests, delivered to your doorstep with divine care.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
          <div className="space-y-2">
            <Link to="/" className="block text-sm text-secondary-foreground/70 hover:text-gold transition-colors">Home</Link>
            <Link to="/idols" className="block text-sm text-secondary-foreground/70 hover:text-gold transition-colors">Idols</Link>
            <Link to="/contact" className="block text-sm text-secondary-foreground/70 hover:text-gold transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
          <div className="space-y-3">
            <a href="tel:+918309326395" className="flex items-center gap-2 text-sm text-secondary-foreground/70 hover:text-gold transition-colors">
              <Phone className="w-4 h-4" /> +91 8309 326 395
            </a>
            <a href="mailto:admin.mipar@gmail.com" className="flex items-center gap-2 text-sm text-secondary-foreground/70 hover:text-gold transition-colors">
              <Mail className="w-4 h-4" /> admin.mipar@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10 mt-8 pt-6 text-center">
        <p className="text-sm text-secondary-foreground/50">© {new Date().getFullYear()} MIPAR Sacred Idols. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
