import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Trending } from './components/Trending';
import { Stats } from './components/Stats';
import { Testimonials } from './components/Testimonials';
import { CTASection } from './components/CTASection';
import { Footer } from '@/components/shared/Footer';

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is logged in, redirect to dashboard
  if (session) {
    if (session.user?.is_admin) {
      redirect('/dashboard/admin');
    } else {
      redirect('/dashboard/user');
    }
  }

  // If not logged in, show stunning landing page
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Hero />
      <Stats />
      <Features />
      <Trending />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}