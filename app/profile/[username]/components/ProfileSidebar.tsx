'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Image,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Award,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface ProfileSidebarProps {
  user: any;
}

export function ProfileSidebar({ user }: ProfileSidebarProps) {
  const [showAll, setShowAll] = useState(false);

  const highlights = [
    { icon: Award, label: 'Top Contributor', color: 'text-yellow-500' },
    { icon: Briefcase, label: 'Software Engineer at Tech Co', color: 'text-blue-500' },
    { icon: GraduationCap, label: 'University of Technology', color: 'text-green-500' },
  ];

  const suggestedUsers = [
    { id: 1, name: 'Alex Johnson', username: 'alexj', bio: 'Digital Creator ✨', avatar: '' },
    { id: 2, name: 'Sarah Williams', username: 'sarahw', bio: 'Photographer 📸', avatar: '' },
    { id: 3, name: 'Mike Chen', username: 'mikec', bio: 'Developer & Designer', avatar: '' },
    { id: 4, name: 'Emma Davis', username: 'emmad', bio: 'Travel Blogger ✈️', avatar: '' },
    { id: 5, name: 'Chris Lee', username: 'chrisl', bio: 'Music Producer 🎵', avatar: '' },
  ];

  const displayedUsers = showAll ? suggestedUsers : suggestedUsers.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* About Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2" />
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-600" />
              About
            </h3>
            {user.bio ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {user.bio}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic mb-4">No bio yet</p>
            )}

            <div className="space-y-2">
              {user.location && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 group hover:text-purple-600 transition"
                >
                  <MapPin className="h-4 w-4 mr-2 text-purple-500 group-hover:scale-110 transition" />
                  {user.location}
                </motion.div>
              )}
              {user.website && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center text-sm text-gray-600 dark:text-gray-400 group hover:text-purple-600 transition"
                >
                  <LinkIcon className="h-4 w-4 mr-2 text-purple-500 group-hover:scale-110 transition" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    {user.website.replace(/^https?:\/\//, '')}
                  </a>
                </motion.div>
              )}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400"
              >
                <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                Joined {new Date(user.created_at).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Highlights Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Award className="h-4 w-4 mr-2 text-purple-600" />
              Highlights
            </h3>
            <div className="space-y-3">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Suggested Users Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center justify-between">
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-600" />
                You might know
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAll(!showAll)}
                className="text-purple-600"
              >
                {showAll ? 'Show less' : 'See all'}
              </Button>
            </h3>
            <div className="space-y-3">
              <AnimatePresence>
                {displayedUsers.map((suggested, index) => (
                  <motion.div
                    key={suggested.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between group"
                  >
                    <Link href={`/profile/${suggested.username}`} className="flex items-center space-x-2 flex-1">
                      <Avatar src={suggested.avatar} alt={suggested.username} size="sm" />
                      <div>
                        <p className="text-sm font-medium group-hover:text-purple-600 transition">
                          {suggested.name}
                        </p>
                        <p className="text-xs text-gray-500">@{suggested.username}</p>
                        <p className="text-xs text-gray-400">{suggested.bio}</p>
                      </div>
                    </Link>
                    <Button size="sm" variant="outline" className="ml-2">
                      Follow
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Heart className="h-4 w-4 mr-2 text-purple-600" />
              Recent Activity
            </h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Commented on a post</span>
                  </div>
                  <span className="text-xs text-gray-400">2h ago</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}