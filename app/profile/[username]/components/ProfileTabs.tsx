'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3x3, Bookmark, Heart, Film, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Post } from '@/app/dashboard/user/components/Post';

interface ProfileTabsProps {
  userId: string;
  username: string;
  initialPosts: any[];
  currentUserId?: string;
}

export function ProfileTabs({ userId, username, initialPosts, currentUserId }: ProfileTabsProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    { id: 'posts', label: 'Posts', icon: Grid3x3 },
    { id: 'reels', label: 'Reels', icon: Film },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'liked', label: 'Liked', icon: Heart },
  ];

  const mediaTabs = [
    { id: 'all', icon: Grid3x3 },
    { id: 'images', icon: ImageIcon },
    { id: 'videos', icon: Video },
    { id: 'articles', icon: FileText },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Main Tabs */}
      <Tabs defaultValue="posts" className="w-full" onValueChange={setActiveTab}>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <TabsList className="w-full justify-start bg-transparent h-auto p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 md:flex-none px-6 py-4 rounded-none data-[state=active]:bg-transparent data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600"
              >
                <tab.icon className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Media Type Filters - Only show for posts tab */}
        {activeTab === 'posts' && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <TabsList className="bg-transparent space-x-2">
              {mediaTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-3 py-1.5 rounded-full data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <tab.icon className="h-4 w-4" />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        )}

        {/* Posts Grid */}
        <TabsContent value="posts" className="p-4">
          {posts.length > 0 ? (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg"
                  >
                    {post.media_urls?.[0] ? (
                      <img
                        src={post.media_urls[0]}
                        alt={post.content || 'Post'}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="flex items-center">
                          <Heart className="h-5 w-5 mr-1" />
                          <span>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Bookmark className="h-5 w-5 mr-1" />
                          <span>{post.comments_count || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Media Type Badge */}
                    {post.media_types?.[0] === 'video' && (
                      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                        <Video className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-500">When {username} posts, they'll appear here</p>
            </div>
          )}
        </TabsContent>

        {/* Other Tabs Content */}
        <TabsContent value="reels">
          <div className="text-center py-16">
            <Film className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No reels yet</h3>
            <p className="text-gray-500">Reels will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="text-center py-16">
            <Bookmark className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No saved posts</h3>
            <p className="text-gray-500">Posts you save will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="liked">
          <div className="text-center py-16">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No liked posts</h3>
            <p className="text-gray-500">Posts you like will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}