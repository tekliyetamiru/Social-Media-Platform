'use client';

import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Post } from './Post';
import { PostSkeleton } from './PostSkeleton';
import { Post as PostType } from '@/types';

interface FeedProps {
  userId: string;
}

// Mock data - define with unique values for each post
const MOCK_POSTS: PostType[] = [
  {
    id: '1',
    user_id: '1',
    username: 'johndoe',
    full_name: 'John Doe',
    avatar_url: 'https://i.pravatar.cc/150?u=1',
    content: 'Just finished building this amazing social media platform! 🚀 The journey was incredible. #coding #webdev',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    likes_count: 42,
    comments_count: 7,
    is_liked: false,
    is_bookmarked: false,
    visibility: 'public',
  },
  {
    id: '2',
    user_id: '2',
    username: 'janedoe',
    full_name: 'Jane Doe',
    avatar_url: 'https://i.pravatar.cc/150?u=2',
    content: 'Beautiful sunset today! 🌅',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    likes_count: 128,
    comments_count: 23,
    is_liked: true,
    is_bookmarked: false,
    visibility: 'public',
    media_urls: ['https://picsum.photos/800/600?random=1'],
    media_types: ['image'],
  },
  {
    id: '3',
    user_id: '3',
    username: 'techguru',
    full_name: 'Tech Guru',
    avatar_url: 'https://i.pravatar.cc/150?u=3',
    content: 'Check out this new React feature! 🎯\n\nuse() hook is amazing for async data fetching. What do you think?',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    likes_count: 89,
    comments_count: 15,
    is_liked: false,
    is_bookmarked: true,
    visibility: 'public',
    tags: ['react', 'javascript', 'webdev'],
  },
  {
    id: '4',
    user_id: '4',
    username: 'traveler',
    full_name: 'Travel Explorer',
    avatar_url: 'https://i.pravatar.cc/150?u=4',
    content: 'Exploring the beautiful mountains! 🏔️ #travel #adventure',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    likes_count: 256,
    comments_count: 34,
    is_liked: false,
    is_bookmarked: false,
    visibility: 'public',
    media_urls: ['https://picsum.photos/800/600?random=2'],
    media_types: ['image'],
  },
  {
    id: '5',
    user_id: '5',
    username: 'foodie',
    full_name: 'Food Lover',
    avatar_url: 'https://i.pravatar.cc/150?u=5',
    content: 'Homemade pasta for dinner! 🍝 So delicious! #food #cooking',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    likes_count: 67,
    comments_count: 12,
    is_liked: true,
    is_bookmarked: false,
    visibility: 'public',
    media_urls: ['https://picsum.photos/800/600?random=3'],
    media_types: ['image'],
  },
];

export function Feed({ userId }: FeedProps) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add more mock posts - create new instances with unique IDs
      const newPosts = MOCK_POSTS.map((post, index) => ({
        ...post,
        id: `${post.id}-${page}-${index}`,
        created_at: new Date(Date.now() - (page * 86400000) - (index * 3600000)).toISOString(),
      }));

      setPosts((prev) => [...prev, ...newPosts]);
      setPage((prev) => prev + 1);
      setHasMore(page < 3); // Only 3 pages
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  const handlePostUpdate = (updatedPost: PostType) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          currentUserId={userId}
          onUpdate={handlePostUpdate}
          onDelete={handlePostDelete}
        />
      ))}

      {loading && (
        <>
          <PostSkeleton />
          <PostSkeleton />
        </>
      )}

      {hasMore && <div ref={ref} className="h-10" />}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-500 py-4">
          You've reached the end! 🎉
        </p>
      )}

      {!loading && posts.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
          <p className="text-gray-500">
            Follow some users or create your first post!
          </p>
        </div>
      )}
    </div>
  );
}