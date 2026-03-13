'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Hash, Flame, TrendingUp, Users, MessageCircle, Heart } from 'lucide-react';

interface TrendingItem {
  type: 'post' | 'hashtag';
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  engagement: number;
  likes?: number;
  comments?: number;
}

export function Trending() {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        // Mock data with more details
        const mockTrending = [
          { 
            type: 'hashtag', 
            id: '1', 
            title: '#technology', 
            engagement: 15432,
            posts: 1234 
          },
          { 
            type: 'hashtag', 
            id: '2', 
            title: '#coding', 
            engagement: 12345,
            posts: 987 
          },
          { 
            type: 'hashtag', 
            id: '3', 
            title: '#webdev', 
            engagement: 10987,
            posts: 876 
          },
          { 
            type: 'post', 
            id: '4', 
            title: 'Sarah Johnson', 
            subtitle: 'Just launched my new portfolio! Check it out 🚀',
            image: 'https://i.pravatar.cc/150?u=1',
            engagement: 8765,
            likes: 432,
            comments: 89
          },
          { 
            type: 'post', 
            id: '5', 
            title: 'Mike Chen', 
            subtitle: 'Beautiful sunset at the beach today 🌅',
            image: 'https://i.pravatar.cc/150?u=2',
            engagement: 7654,
            likes: 321,
            comments: 45
          },
          { 
            type: 'post', 
            id: '6', 
            title: 'Emily Rodriguez', 
            subtitle: 'New artwork coming soon! ✨',
            image: 'https://i.pravatar.cc/150?u=3',
            engagement: 6543,
            likes: 234,
            comments: 56
          },
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
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Trending Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Trending Now
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover what's popular in the community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trending.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="flex items-start gap-4">
                  {/* Avatar/Icon */}
                  <div className="relative">
                    {item.type === 'post' ? (
                      <Avatar 
                        src={item.image} 
                        alt={item.title} 
                        size="lg" 
                        className="ring-2 ring-purple-600/20 group-hover:ring-purple-600 transition-all"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Hash className="h-8 w-8 text-white" />
                      </div>
                    )}
                    
                    {/* Trending Badge */}
                    {index < 3 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1.5 shadow-lg">
                        <Flame className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-lg truncate group-hover:text-purple-600 transition-colors">
                        {item.title}
                      </p>
                      {item.type === 'hashtag' && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                          Trending
                        </span>
                      )}
                    </div>
                    
                    {item.subtitle && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {item.subtitle}
                      </p>
                    )}

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium text-purple-600">
                          {item.engagement.toLocaleString()}
                        </span>
                      </div>
                      
                      {item.type === 'post' && (
                        <>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Heart className="h-4 w-4" />
                            <span>{item.likes?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{item.comments?.toLocaleString()}</span>
                          </div>
                        </>
                      )}

                      {item.type === 'hashtag' && (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>{item.engagement} posts</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full group-hover:bg-purple-600 group-hover:text-white transition-all"
                    asChild
                  >
                    <Link href={item.type === 'hashtag' ? `/hashtag/${item.title.slice(1)}` : `/profile/${item.title.toLowerCase().replace(' ', '')}`}>
                      {item.type === 'hashtag' ? 'Explore Hashtag' : 'View Profile'}
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Preview for guests */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Want to see more?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Join our community to access full posts, create content, and connect with millions of users worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg" asChild>
                <Link href="/signup">
                  Create Free Account
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}