'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  BarChart3,
  Shield,
  Activity,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Flag,
  Database,
  Server,
  Globe,
  Lock,
  UserCog,
  FolderOpen,
  Image,
  Video,
  Calendar,
  MessageSquare,
  Heart,
  Share2,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  Moon,
  Sun,
  Megaphone,
  Mail, 
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { useTheme } from 'next-themes';
import { toast } from 'react-hot-toast';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  submenu?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Users Management',
    href: '/dashboard/admin/users',
    icon: Users,
    submenu: [
      { name: 'All Users', href: '/dashboard/admin/users', icon: Users },
      { name: 'Verified Users', href: '/dashboard/admin/users/verified', icon: UserCog },
      { name: 'Banned Users', href: '/dashboard/admin/users/banned', icon: Lock },
      { name: 'User Roles', href: '/dashboard/admin/users/roles', icon: Shield },
    ],
  },
  {
    name: 'Posts',
    href: '/dashboard/admin/posts',
    icon: FileText,
    badge: 234,
    submenu: [
      { name: 'All Posts', href: '/dashboard/admin/posts', icon: FileText },
      { name: 'Pending Review', href: '/dashboard/admin/posts/pending', icon: AlertTriangle, badge: 23 },
      { name: 'Reported Posts', href: '/dashboard/admin/posts/reported', icon: Flag, badge: 12 },
      { name: 'Archived', href: '/dashboard/admin/posts/archived', icon: FolderOpen },
      { name: 'Media', href: '/dashboard/admin/posts/media', icon: Image },
      { name: 'Videos', href: '/dashboard/admin/posts/videos', icon: Video },
    ],
  },
  {
    name: 'Comments',
    href: '/dashboard/admin/comments',
    icon: MessageCircle,
    badge: 89,
    submenu: [
      { name: 'All Comments', href: '/dashboard/admin/comments', icon: MessageCircle },
      { name: 'Reported', href: '/dashboard/admin/comments/reported', icon: Flag, badge: 8 },
      { name: 'Spam', href: '/dashboard/admin/comments/spam', icon: AlertTriangle, badge: 15 },
    ],
  },
  {
    name: 'Reports',
    href: '/dashboard/admin/reports',
    icon: Flag,
    badge: 23,
    submenu: [
      { name: 'Content Reports', href: '/dashboard/admin/reports/content', icon: FileText, badge: 12 },
      { name: 'User Reports', href: '/dashboard/admin/reports/users', icon: Users, badge: 8 },
      { name: 'Comment Reports', href: '/dashboard/admin/reports/comments', icon: MessageCircle, badge: 3 },
      { name: 'Resolved', href: '/dashboard/admin/reports/resolved', icon: Shield },
    ],
  },
  {
    name: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: BarChart3,
    submenu: [
      { name: 'Overview', href: '/dashboard/admin/analytics', icon: TrendingUp },
      { name: 'User Growth', href: '/dashboard/admin/analytics/users', icon: Users },
      { name: 'Content Metrics', href: '/dashboard/admin/analytics/content', icon: FileText },
      { name: 'Engagement', href: '/dashboard/admin/analytics/engagement', icon: Heart },
      { name: 'Downloads', href: '/dashboard/admin/analytics/downloads', icon: Download },
      { name: 'Reports', href: '/dashboard/admin/analytics/reports', icon: Flag },
    ],
  },
  {
    name: 'Moderation',
    href: '/dashboard/admin/moderation',
    icon: Shield,
    badge: 45,
    submenu: [
      { name: 'Queue', href: '/dashboard/admin/moderation', icon: AlertTriangle, badge: 45 },
      { name: 'Auto-Moderation', href: '/dashboard/admin/moderation/auto', icon: Server },
      { name: 'Filters', href: '/dashboard/admin/moderation/filters', icon: Shield },
      { name: 'Blocked Words', href: '/dashboard/admin/moderation/words', icon: Lock },
      { name: 'Shadow Bans', href: '/dashboard/admin/moderation/shadow', icon: UserCog },
      { name: 'Appeals', href: '/dashboard/admin/moderation/appeals', icon: MessageSquare },
    ],
  },
  {
    name: 'Activity',
    href: '/dashboard/admin/activity',
    icon: Activity,
    submenu: [
      { name: 'Live Activity', href: '/dashboard/admin/activity/live', icon: Activity },
      { name: 'User Logs', href: '/dashboard/admin/activity/users', icon: Users },
      { name: 'System Logs', href: '/dashboard/admin/activity/system', icon: Server },
      { name: 'Audit Trail', href: '/dashboard/admin/activity/audit', icon: Database },
    ],
  },
  {
    name: 'Notifications',
    href: '/dashboard/admin/notifications',
    icon: Bell,
    badge: 12,
    submenu: [
      { name: 'All Notifications', href: '/dashboard/admin/notifications', icon: Bell, badge: 12 },
      { name: 'Announcements', href: '/dashboard/admin/notifications/announcements', icon: Megaphone },
      { name: 'Broadcast', href: '/dashboard/admin/notifications/broadcast', icon: Globe },
      { name: 'Templates', href: '/dashboard/admin/notifications/templates', icon: FileText },
    ],
  },
  {
    name: 'Settings',
    href: '/dashboard/admin/settings',
    icon: Settings,
    submenu: [
      { name: 'General', href: '/dashboard/admin/settings/general', icon: Settings },
      { name: 'Security', href: '/dashboard/admin/settings/security', icon: Lock },
      { name: 'Privacy', href: '/dashboard/admin/settings/privacy', icon: Shield },
      { name: 'API', href: '/dashboard/admin/settings/api', icon: Server },
      { name: 'Email', href: '/dashboard/admin/settings/email', icon: Mail },
      { name: 'Backup', href: '/dashboard/admin/settings/backup', icon: Database },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const isActive = (href: string) => {
    if (href === '/dashboard/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-4 right-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarCollapsed ? false : true) && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl z-40 overflow-y-auto transition-all duration-300 ${
              sidebarCollapsed ? 'w-20' : 'w-80'
            } ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}
          >
            <div className="p-6">
              {/* Logo */}
              <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard/admin" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Admin Panel
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:block p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <ChevronLeft className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Admin Profile */}
              <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar
                    src={session?.user?.avatar_url}
                    alt={session?.user?.username || 'Admin'}
                    size="md"
                  />
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{session?.user?.name || 'Admin'}</p>
                      <p className="text-sm text-gray-500 truncate">@{session?.user?.username}</p>
                      <p className="text-xs text-purple-600 font-medium mt-1">Administrator</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isExpanded = expandedMenus.includes(item.name);

                  return (
                    <div key={item.name} className="space-y-1">
                      <div
                        className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition ${
                          active && !hasSubmenu
                            ? 'bg-purple-600 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          if (hasSubmenu) {
                            toggleSubmenu(item.name);
                          } else {
                            router.push(item.href);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <item.icon className={`h-5 w-5 ${active && !hasSubmenu ? 'text-white' : ''}`} />
                          {!sidebarCollapsed && (
                            <>
                              <span className="text-sm font-medium">{item.name}</span>
                              {item.badge && (
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  active && !hasSubmenu
                                    ? 'bg-white text-purple-600'
                                    : 'bg-red-500 text-white'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        {hasSubmenu && !sidebarCollapsed && (
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        )}
                      </div>

                      {/* Submenu */}
                      {hasSubmenu && isExpanded && !sidebarCollapsed && (
                        <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1">
                          {item.submenu?.map((subItem) => {
                            const subActive = pathname === subItem.href;
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`flex items-center justify-between px-4 py-2 rounded-lg transition ${
                                  subActive
                                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  <subItem.icon className="h-4 w-4" />
                                  <span className="text-sm">{subItem.name}</span>
                                </div>
                                {subItem.badge && (
                                  <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                    {subItem.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  <LogOut className="h-5 w-5" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
                </button>
              </div>

              {/* Version Info */}
              {!sidebarCollapsed && (
                <div className="mt-4 text-center text-xs text-gray-400">
                  <p>Admin Panel v1.0.0</p>
                  <p>© 2024 SocialFlow</p>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
        } p-6`}
      >
        {children}
      </main>
    </div>
  );
}