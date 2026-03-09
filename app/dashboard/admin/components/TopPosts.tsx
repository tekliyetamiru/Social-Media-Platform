'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';

interface TopPost {
  id: string;
  content: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  user: {
    username: string;
    avatar_url: string;
  };
}

export function TopPosts() {
  const [posts, setPosts] = useState<TopPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setPosts([
      {
        id: '1',
        content: 'Just launched our new feature! 🚀',
        likes_count: 1243,
        comments_count: 89,
        views_count: 15234,
        user: { username: 'techguru', avatar_url: '' },
      },
      {
        id: '2',
        content: 'Check out this amazing sunset 🌅',
        likes_count: 987,
        comments_count: 45,
        views_count: 12345,
        user: { username: 'photolover', avatar_url: '' },
      },
      {
        id: '3',
        content: "React 19 is here! Here's what you need to know...", // Fixed: escaped apostrophe
        likes_count: 876,
        comments_count: 67,
        views_count: 10987,
        user: { username: 'reactdev', avatar_url: '' },
      },
      {
        id: '4',
        content: 'My development setup 2024 💻',
        likes_count: 654,
        comments_count: 34,
        views_count: 8765,
        user: { username: 'devlife', avatar_url: '' },
      },
      {
        id: '5',
        content: '10 tips for better code quality',
        likes_count: 543,
        comments_count: 23,
        views_count: 7654,
        user: { username: 'codingpro', avatar_url: '' },
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition"
            >
              <Avatar src={post.user.avatar_url} alt={post.user.username} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">{post.user.username}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Heart className="h-3 w-3 mr-1" />
                    {post.likes_count}
                  </span>
                  <span className="flex items-center">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {post.comments_count}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {post.views_count}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}