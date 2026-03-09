import { pool } from './index';
import { User, Post, Comment } from '@/types';

// Helper to check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Mock data for when database is unavailable
const mockPosts = [
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
    visibility: 'public' as const,
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
    visibility: 'public' as const,
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
    visibility: 'public' as const,
    tags: ['react', 'javascript', 'webdev'],
  },
];

export const db = {
  users: {
    async create(userData: any) {
      if (isBrowser) return null;
      const query = `
        INSERT INTO users (username, email, password_hash, full_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, full_name, created_at
      `;
      const values = [userData.username, userData.email, userData.password_hash, userData.full_name];
      try {
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        console.error('Error creating user:', error);
        return null;
      }
    },

    async findByEmail(email: string) {
      if (isBrowser) return null;
      const query = 'SELECT * FROM users WHERE email = $1';
      try {
        const result = await pool.query(query, [email]);
        return result.rows[0];
      } catch (error) {
        console.error('Error finding user by email:', error);
        return null;
      }
    },

    async findByUsername(username: string) {
      if (isBrowser) return null;
      const query = 'SELECT * FROM users WHERE username = $1';
      try {
        const result = await pool.query(query, [username]);
        return result.rows[0];
      } catch (error) {
        console.error('Error finding user by username:', error);
        // Return mock user for development
        return {
          id: '1',
          username: username,
          email: `${username}@example.com`,
          full_name: username,
          bio: 'This is a sample bio',
          avatar_url: 'https://i.pravatar.cc/150?u=' + username,
          cover_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
          created_at: new Date().toISOString(),
          is_verified: true,
          is_private: false,
          is_admin: username === 'admin',
          location: 'New York, USA',
          website: 'https://example.com',
        };
      }
    },

    async findById(id: string) {
      if (isBrowser) return null;
      const query = 'SELECT id, username, email, full_name, bio, avatar_url, created_at FROM users WHERE id = $1';
      try {
        const result = await pool.query(query, [id]);
        return result.rows[0];
      } catch (error) {
        console.error('Error finding user by id:', error);
        return null;
      }
    },

    async getFollowersCount(userId: string) {
      if (isBrowser) return 1234;
      try {
        // Replace with actual query
        return 1234;
      } catch (error) {
        console.error('Error getting followers count:', error);
        return 0;
      }
    },

    async getFollowingCount(userId: string) {
      if (isBrowser) return 567;
      try {
        // Replace with actual query
        return 567;
      } catch (error) {
        console.error('Error getting following count:', error);
        return 0;
      }
    },

    async isFollowing(followerId: string, followingId: string) {
      if (isBrowser) return false;
      try {
        // Replace with actual query
        return false;
      } catch (error) {
        console.error('Error checking follow status:', error);
        return false;
      }
    },

    async isCloseFriend(userId: string, friendId: string) {
      if (isBrowser) return false;
      try {
        // Replace with actual query
        return false;
      } catch (error) {
        console.error('Error checking close friend status:', error);
        return false;
      }
    },
  },

  posts: {
    async getFeed(userId: string, limit: number = 10, offset: number = 0) {
      // Return mock data for now
      return mockPosts;
    },

    async getUserPosts(userId: string, viewerId: string | null, limit: number, offset: number) {
      // Return mock data
      return mockPosts;
    },

    async getExploreFeed(limit: number = 10, offset: number = 0) {
      return mockPosts;
    },

    async like(postId: string, userId: string) {
      console.log('Like post:', postId, userId);
      return { success: true };
    },

    async unlike(postId: string, userId: string) {
      console.log('Unlike post:', postId, userId);
      return { success: true };
    },

    async addReaction(postId: string, userId: string, reactionType: string) {
      console.log('Add reaction:', postId, userId, reactionType);
      return { success: true };
    },

    async delete(postId: string) {
      console.log('Delete post:', postId);
      return { success: true };
    },

    async archive(postId: string) {
      console.log('Archive post:', postId);
      return { success: true };
    },
  },

  hashtags: {
    async getTrending(limit: number = 5) {
      return [
        { id: '1', name: 'technology', posts_count: 15432 },
        { id: '2', name: 'coding', posts_count: 12345 },
        { id: '3', name: 'webdev', posts_count: 10987 },
      ];
    },
  },
};