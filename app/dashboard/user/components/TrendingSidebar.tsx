'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Hash, TrendingUp, Users } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

interface TrendingTopic {
  id: string;
  name: string;
  posts_count: number;
}

interface SuggestedUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
}

export function TrendingSidebar() {
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [suggested, setSuggested] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTrending([
      { id: '1', name: 'technology', posts_count: 1234 },
      { id: '2', name: 'coding', posts_count: 987 },
      { id: '3', name: 'webdev', posts_count: 654 },
      { id: '4', name: 'react', posts_count: 432 },
      { id: '5', name: 'nextjs', posts_count: 321 },
    ]);

    setSuggested([
      {
        id: '1',
        username: 'johndoe',
        full_name: 'John Doe',
        avatar_url: '',
      },
      {
        id: '2',
        username: 'janedoe',
        full_name: 'Jane Doe',
        avatar_url: '',
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sticky top-20">
      {/* Trending Topics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <h2 className="font-semibold mb-3 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
          Trending Today
        </h2>
        <div className="space-y-2">
          {trending.map((topic) => (
            <Link
              key={topic.id}
              href={`/hashtag/${topic.name}`}
              className="flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
            >
              <div className="flex items-center">
                <Hash className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm font-medium">{topic.name}</span>
              </div>
              <span className="text-xs text-gray-500">{topic.posts_count} posts</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
        <h2 className="font-semibold mb-3 flex items-center">
          <Users className="h-5 w-5 mr-2 text-purple-600" />
          Suggested for You
        </h2>
        <div className="space-y-3">
          {suggested.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <Link href={`/profile/${user.username}`} className="flex items-center space-x-2">
                <Avatar src={user.avatar_url} alt={user.username} size="sm" />
                <div>
                  <p className="text-sm font-medium">{user.full_name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </Link>
              <Button size="sm" variant="outline">Follow</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}