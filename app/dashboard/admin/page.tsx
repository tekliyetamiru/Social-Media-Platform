import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth';
import { AdminStats } from './components/AdminStats';
import { RecentReports } from './components/RecentReports';
import { UserGrowthChart } from './components/UserGrowthChart';
import { TopPosts } from './components/TopPosts';
import { ModerationQueue } from './components/ModerationQueue';
import { ActivityFeed } from './components/ActivityFeed';
import { QuickActions } from './components/QuickActions';
import { SystemHealth } from './components/SystemHealth';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.is_admin) {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Stats Grid */}
      <AdminStats />

      {/* System Health */}
      <SystemHealth />

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserGrowthChart />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Moderation Queue and Top Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModerationQueue />
        <TopPosts />
      </div>

      {/* Recent Reports */}
      <RecentReports />
    </div>
  );
}