// app/(dashboard)/user/live/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Video,
  Users,
  Calendar,
  Clock,
  Play,
  Settings,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { StartLiveModal } from './components/StartLiveModal';
import { LivePlayer } from './components/LivePlayer';
import { formatDistanceToNow } from 'date-fns';

interface LiveStream {
  id: string;
  title: string;
  user: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
  };
  thumbnail_url?: string;
  viewer_count: number;
  started_at: string;
  status: 'live' | 'scheduled' | 'ended';
  scheduled_for?: string;
}

export default function LivePage() {
  const router = useRouter();
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [scheduledStreams, setScheduledStreams] = useState<LiveStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const [liveRes, scheduledRes] = await Promise.all([
        fetch('/api/live/active'),
        fetch('/api/live/scheduled'),
      ]);

      const liveData = await liveRes.json();
      const scheduledData = await scheduledRes.json();

      setLiveStreams(liveData);
      setScheduledStreams(scheduledData);
    } catch (error) {
      console.error('Failed to fetch streams:', error);
    } finally {
      setLoading(false);
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
            <h1 className="text-3xl font-bold mb-2">Live Streaming</h1>
            <p className="text-gray-500">
              Watch and create live streams with your community
            </p>
          </div>
          <Button onClick={() => setShowStartModal(true)} className="mt-4 md:mt-0">
            <Video className="h-4 w-4 mr-2" />
            Go Live
          </Button>
        </div>

        {/* Currently Live */}
        {liveStreams.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
              Live Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveStreams.map((stream) => (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedStream(stream)}
                >
                  <Card className="overflow-hidden">
                    <div className="relative aspect-video bg-black">
                      {stream.thumbnail_url ? (
                        <img
                          src={stream.thumbnail_url}
                          alt={stream.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-12 w-12 text-gray-600" />
                        </div>
                      )}
                      
                      {/* Live Indicator */}
                      <div className="absolute top-2 left-2 flex items-center space-x-2">
                        <Badge className="bg-red-500 text-white border-0">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1" />
                          LIVE
                        </Badge>
                        <Badge className="bg-black/50 text-white border-0">
                          <Users className="h-3 w-3 mr-1" />
                          {stream.viewer_count}
                        </Badge>
                      </div>

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                          <Play className="h-6 w-6 text-black ml-1" />
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar
                          src={stream.user.avatar_url}
                          alt={stream.user.username}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{stream.title}</h3>
                          <p className="text-sm text-gray-500">
                            {stream.user.full_name || stream.user.username}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Started {formatDistanceToNow(new Date(stream.started_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Scheduled Streams */}
        {scheduledStreams.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Scheduled</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledStreams.map((stream) => (
                <Card key={stream.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar
                        src={stream.user.avatar_url}
                        alt={stream.user.username}
                      />
                      <div>
                        <p className="font-semibold">
                          {stream.user.full_name || stream.user.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{stream.user.username}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-medium mb-2">{stream.title}</h3>

                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                      <Clock className="h-4 w-4" />
                      <span>
                        {stream.scheduled_for && 
                          formatDistanceToNow(new Date(stream.scheduled_for), { addSuffix: true })}
                      </span>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Calendar className="h-4 w-4 mr-2" />
                      Remind Me
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {liveStreams.length === 0 && scheduledStreams.length === 0 && (
          <div className="text-center py-12">
            <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No live streams</h3>
            <p className="text-gray-500 mb-4">
              There are no active or scheduled streams right now
            </p>
            <Button onClick={() => setShowStartModal(true)}>
              Start Your Own Stream
            </Button>
          </div>
        )}
      </div>

      {/* Start Live Modal */}
      {showStartModal && (
        <StartLiveModal
          onClose={() => setShowStartModal(false)}
          onSuccess={(streamId) => {
            router.push(`/live/${streamId}`);
          }}
        />
      )}

      {/* Live Player Modal */}
      {selectedStream && (
        <LivePlayer
          stream={selectedStream}
          onClose={() => setSelectedStream(null)}
        />
      )}
    </div>
  );
}