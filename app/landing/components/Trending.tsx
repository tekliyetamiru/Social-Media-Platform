'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { db } from '@/lib/db/queries';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Hash, Flame } from 'lucide-react';  // Replace heroicons with lucide-react

interface TrendingItem {
  type: 'post' | 'hashtag';
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  engagement: number;
}

export function Trending() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        // Mock data for now - replace with actual API calls
        const mockTrending = [
          { type: 'hashtag', id: '1', title: '#technology', engagement: 15432 },
          { type: 'hashtag', id: '2', title: '#coding', engagement: 12345 },
          { type: 'hashtag', id: '3', title: '#webdev', engagement: 10987 },
          { type: 'post', id: '4', title: 'johndoe', subtitle: 'Amazing new features...', engagement: 8765 },
          { type: 'post', id: '5', title: 'janedoe', subtitle: 'Check this out!', engagement: 7654 },
        ];
        
        setTrending(mockTrending);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Trending Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <Flame className="h-8 w-8 text-orange-500" />
            Trending Now
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {trending.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    {item.type === 'post' ? (
                      <Avatar src={item.image} alt={item.title} />
                    ) : (
                      <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.subtitle}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">
                        {item.engagement.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">engagements</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Preview posts for guests */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Want to see more? Join our community to access full posts, create content, and connect with others.
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/signup">Sign up for free</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}