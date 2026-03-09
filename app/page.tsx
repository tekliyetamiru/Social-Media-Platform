import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If user is logged in, check if they're admin
  if (session) {
    if (session.user?.is_admin) {
      redirect('/dashboard/admin');
    } else {
      redirect('/dashboard/user');
    }
  }

  // If not logged in, show landing page
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-600 to-pink-600">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          SocialFlow
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Connect with the world
        </p>
        
        <div className="space-x-4">
          <a 
            href="/login"  // Changed from /auth/login to /login
            className="inline-block bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition"
          >
            Login
          </a>
          <a 
            href="/signup"  // Changed from /auth/signup to /signup
            className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  );
}