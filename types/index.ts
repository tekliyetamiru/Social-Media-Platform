export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  password_hash: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  is_verified: boolean;
  is_private: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content?: string;
  media_urls?: string[];
  media_types?: string[];
  visibility: 'public' | 'followers' | 'close_friends';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  likes_count: number;
  created_at: string;
}