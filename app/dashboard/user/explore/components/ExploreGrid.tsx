// app/(dashboard)/user/explore/components/ExploreGrid.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Play, Image as ImageIcon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { db } from '@/lib/db/queries';

interface ExploreGridProps {
  category: string;
}

export function ExploreGrid({ category }: ExploreGridProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      let newPosts;
      if (category === 'for-you') {
        newPosts = await fetch(`/api/posts/explore?limit=12&offset=${(page - 1) * 12}`).then(r => r.json());
      } else if (category === 'trending') {
        newPosts = await fetch(`/api/posts/trending?limit=12&offset=${(page - 1) * 12}`).then(r => r.json());
      } else if (category === 'photos') {
        newPosts = await fetch(`/api/posts/media?type=image&limit=12&offset=${(page - 1) * 12}`).then(r => r.json());
      } else {
        newPosts = [];
      }

      if (newPosts.length < 12) {
        setHasMore(false);
      }

      setPosts(prev => [...prev, ...newPosts]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load explore posts:', error);
    } finally {
      setLoading(false);
    }
  }, [category, page, loading, hasMore]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadPosts();
  }, [category]);

  useEffect(() => {
    if (inView) {
      loadPosts();
    }
  }, [inView, loadPosts]);

  if (posts.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
        <p className="text-gray-500">Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="relative aspect-square group cursor-pointer"
          >
            <Link href={`/post/${post.id}`}>
              <div className="relative w-full h-full">
                {post.media_urls?.[0] ? (
                  <Image
                    src={post.media_urls[0]}
                    alt={post.content || 'Post image'}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-bold">📝</span>
                  </div>
                )}

                {/* Media Type Indicator */}
                {post.media_types?.[0] === 'video' && (
                  <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-white">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 mr-1" />
                      <span>{post.likes_count}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      <span>{post.comments_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {hasMore && <div ref={ref} className="h-10" />}
    </div>
  );
}