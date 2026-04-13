import { Phone, Mail, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ContactPage = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="container mx-auto px-4 py-16 flex-1 max-w-2xl">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">Contact Us</h1>
      <div className="space-y-6">
        <a href="tel:+918309326395" className="flex items-center gap-4 bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Phone</p>
            <p className="text-muted-foreground">+91 8309 326 395</p>
          </div>
        </a>
        <a href="mailto:admin.mipar@gmail.com" className="flex items-center gap-4 bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Email</p>
            <p className="text-muted-foreground">admin.mipar@gmail.com</p>
          </div>
        </a>
      </div>
    </div>
    <Footer />
  </div>
);

export default ContactPage;
