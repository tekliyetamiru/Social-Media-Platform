'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  Filter,
  Clock,
  Video,
  Globe,
  ChevronRight,
  Star,
  Heart,
  Share2,
  Bell,
} from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { CreateEventModal } from './components/CreateEventModal';
import { EventCard } from './components/EventCard';
import { EventCalendar } from './components/EventCalendar';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      // Mock data - replace with actual API call
      const mockEvents = [
        {
          id: '1',
          title: 'Tech Conference 2024',
          description: 'Join us for the biggest tech conference of the year featuring keynotes from industry leaders.',
          date: '2024-04-15',
          time: '10:00 AM',
          endTime: '6:00 PM',
          location: 'San Francisco Convention Center',
          isOnline: false,
          category: 'Technology',
          attendees: 1234,
          maxAttendees: 2000,
          organizer: {
            id: '1',
            name: 'Tech Events Inc',
            username: 'techevents',
            avatar: '',
          },
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
          tags: ['tech', 'conference', 'networking'],
          isFeatured: true,
        },
        {
          id: '2',
          title: 'Virtual Music Festival',
          description: 'Experience the best music from around the world from the comfort of your home.',
          date: '2024-04-20',
          time: '2:00 PM',
          endTime: '11:00 PM',
          location: 'Online',
          isOnline: true,
          category: 'Music',
          attendees: 3456,
          organizer: {
            id: '2',
            name: 'Global Music',
            username: 'globalmusic',
            avatar: '',
          },
          image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
          tags: ['music', 'festival', 'virtual'],
          isFeatured: true,
        },
        {
          id: '3',
          title: 'Startup Networking Mixer',
          description: 'Connect with founders, investors, and innovators in the startup ecosystem.',
          date: '2024-03-25',
          time: '6:30 PM',
          endTime: '9:30 PM',
          location: 'Downtown Innovation Hub',
          isOnline: false,
          category: 'Business',
          attendees: 89,
          maxAttendees: 150,
          organizer: {
            id: '3',
            name: 'Startup Grind',
            username: 'startupgrind',
            avatar: '',
          },
          image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
          tags: ['startup', 'networking', 'business'],
        },
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'All',
    'Technology',
    'Music',
    'Business',
    'Art',
    'Sports',
    'Food & Drink',
    'Education',
  ];

  const featuredEvents = events.filter(e => e.isFeatured);
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date());
  const todayEvents = events.filter(e => isToday(new Date(e.date)));
  const thisWeekEvents = events.filter(e => isThisWeek(new Date(e.date)) && !isToday(new Date(e.date)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Events
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover and join amazing events happening around you
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Event
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search events by title, location, or category..."
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="py-6">
                <Filter className="h-5 w-5 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="flex-1"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
                className="flex-1"
              >
                Calendar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500 fill-yellow-500" />
              Featured Events
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} featured />
              ))}
            </div>
          </motion.div>
        )}

        {/* Today's Events */}
        {todayEvents.length > 0 && viewMode === 'grid' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Clock className="h-6 w-6 mr-2 text-purple-600" />
              Happening Today
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        {viewMode === 'grid' ? (
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="this-week">This Week</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="this-week">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {thisWeekEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...events].sort((a, b) => b.attendees - a.attendees).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="past">
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No past events</h3>
                <p className="text-gray-500">Past events will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <EventCalendar events={events} />
        )}
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={fetchEvents}
      />
    </div>
  );
}