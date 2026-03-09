// app/(dashboard)/user/events/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  Search,
  Video,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { CreateEventModal } from './components/CreateEventModal';

interface Event {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  start_time: string;
  end_time: string;
  location: string;
  is_online: boolean;
  meeting_url?: string;
  attendees_count: number;
  max_attendees?: number;
  privacy: 'public' | 'private';
  organizer: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
  attendee_status?: 'going' | 'interested' | 'not_going';
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [upcomingRes, myEventsRes] = await Promise.all([
        fetch('/api/events/upcoming'),
        fetch('/api/events/my-events'),
      ]);

      const upcomingData = await upcomingRes.json();
      const myEventsData = await myEventsRes.json();

      setEvents(upcomingData);
      setMyEvents(myEventsData);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventsByTab = () => {
    switch (activeTab) {
      case 'upcoming':
        return filteredEvents.filter(e => new Date(e.start_time) > new Date());
      case 'past':
        return filteredEvents.filter(e => new Date(e.end_time || e.start_time) < new Date());
      case 'my-events':
        return myEvents;
      default:
        return filteredEvents;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-64 animate-pulse">
                <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Events</h1>
            <p className="text-gray-500">
              Discover and join events happening near you
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)} className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-xl mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search events..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="my-events">My Events</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {getEventsByTab().length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-gray-500 mb-4">
                  {activeTab === 'my-events' 
                    ? "You haven't created or joined any events yet"
                    : "Check back later for upcoming events"}
                </p>
                {activeTab === 'my-events' && (
                  <Button onClick={() => setShowCreateModal(true)}>
                    Create Your First Event
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getEventsByTab().map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/events/${event.id}`}>
                      <Card className="h-full hover:shadow-lg transition cursor-pointer overflow-hidden">
                        {/* Cover Image */}
                        <div className="relative h-40">
                          {event.cover_url ? (
                            <Image
                              src={event.cover_url}
                              alt={event.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500" />
                          )}
                          
                          {/* Online Badge */}
                          {event.is_online && (
                            <Badge className="absolute top-2 right-2 bg-black/50 text-white border-0">
                              <Video className="h-3 w-3 mr-1" />
                              Online
                            </Badge>
                          )}

                          {/* Attendee Status */}
                          {event.attendee_status && (
                            <Badge 
                              className={`absolute top-2 left-2 ${
                                event.attendee_status === 'going' 
                                  ? 'bg-green-500' 
                                  : event.attendee_status === 'interested'
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-500'
                              } text-white border-0`}
                            >
                              {event.attendee_status}
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                            {event.title}
                          </h3>

                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {event.description}
                          </p>

                          {/* Date & Time */}
                          <div className="flex items-start space-x-2 mb-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <div className="font-medium">
                                {format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')}
                              </div>
                              <div className="text-gray-500">
                                {format(new Date(event.start_time), 'h:mm a')}
                                {event.end_time && ` - ${format(new Date(event.end_time), 'h:mm a')}`}
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          {event.location && (
                            <div className="flex items-center space-x-2 mb-3 text-sm text-gray-500">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          )}

                          {/* Attendees */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-500">
                              <Users className="h-4 w-4 mr-1" />
                              {event.attendees_count} attending
                              {event.max_attendees && ` / ${event.max_attendees}`}
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <Avatar
                                src={event.organizer.avatar_url}
                                alt={event.organizer.username}
                                size="sm"
                              />
                              <span className="text-gray-500">
                                {event.organizer.full_name || event.organizer.username}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchEvents}
        />
      )}
    </div>
  );
}