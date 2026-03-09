'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Users, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export default function LivePage() {
  const [liveStreams] = useState([
    {
      id: '1',
      user: { username: 'johndoe', name: 'John Doe', avatar: '' },
      title: 'Coding Live Stream',
      viewers: 1234,
      tags: ['coding', 'javascript'],
    },
    {
      id: '2',
      user: { username: 'janesmith', name: 'Jane Smith', avatar: '' },
      title: 'Gaming Session',
      viewers: 567,
      tags: ['gaming', 'twitch'],
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Video className="h-6 w-6 mr-2" />
            Live Now
          </h1>
          <Button>
            <Video className="h-4 w-4 mr-2" />
            Go Live
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {liveStreams.map((stream) => (
            <motion.div
              key={stream.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="cursor-pointer overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center space-x-2">
                    <Badge className="bg-red-500 text-white">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1" />
                      LIVE
                    </Badge>
                    <Badge className="bg-black/50 text-white">
                      <Users className="h-3 w-3 mr-1" />
                      {stream.viewers}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar src={stream.user.avatar} alt={stream.user.username} />
                    <div className="flex-1">
                      <h3 className="font-semibold">{stream.title}</h3>
                      <p className="text-sm text-gray-500">{stream.user.name}</p>
                      <div className="flex gap-2 mt-1">
                        {stream.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}