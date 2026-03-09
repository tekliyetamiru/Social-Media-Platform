import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Trending } from './components/Trending';
import { CTASection } from './components/CTASection';
import { Footer } from '@/components/shared/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Trending />
      <Features />
      <CTASection />
      <Footer />
    </main>
  );
}