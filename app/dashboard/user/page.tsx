import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth';
import { Feed } from './components/Feed';
import { Stories } from './components/Stories';
import { Sidebar } from './components/Sidebar';
import { CreatePost } from './components/CreatePost';
import { TrendingSidebar } from './components/TrendingSidebar';

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <Sidebar user={session.user} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <Stories />
            <CreatePost user={session.user} />
            <Feed userId={session.user.id} />
          </div>

          {/* Right Sidebar - Trending & Suggestions */}
          <div className="lg:col-span-3">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}