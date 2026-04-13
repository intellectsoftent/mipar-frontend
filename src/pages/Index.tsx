import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturedIdols from '@/components/FeaturedIdols';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <FeaturedIdols />
    <HowItWorks />
    <Testimonials />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
