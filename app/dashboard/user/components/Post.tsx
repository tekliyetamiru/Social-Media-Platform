'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Globe,
  Users,
  Lock,
  Star,
  Trash2,
  Edit,
  Archive,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Comments } from './Comments';
import { ReactionPicker } from './ReactionPicker';
import { db } from '@/lib/db/queries';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

interface PostProps {
  post: any;
  currentUserId: string;
  onUpdate?: (post: any) => void;
  onDelete?: (postId: string) => void;
}

export function Post({ post, currentUserId, onUpdate, onDelete }: PostProps) {
  // Add default values for missing data
  const postData = {
    ...post,
    username: post.username || 'unknown',
    full_name: post.full_name || post.username || 'User',
    avatar_url: post.avatar_url || 'https://i.pravatar.cc/150?u=' + (post.user_id || Math.random()),
    content: post.content || '',
    created_at: post.created_at || new Date().toISOString(),
    likes_count: post.likes_count || 0,
    comments_count: post.comments_count || 0,
    is_liked: post.is_liked || false,
    is_bookmarked: post.is_bookmarked || false,
    visibility: post.visibility || 'public',
    media_urls: post.media_urls || [],
  };

  const [isLiked, setIsLiked] = useState(postData.is_liked);
  const [likesCount, setLikesCount] = useState(postData.likes_count);
  const [isSaved, setIsSaved] = useState(postData.is_bookmarked);
  const [showComments, setShowComments] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const visibilityIcons = {
    public: <Globe className="h-4 w-4" />,
    followers: <Users className="h-4 w-4" />,
    close_friends: <Lock className="h-4 w-4" />,
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await db.posts.unlike(post.id, currentUserId);
        setLikesCount((prev) => prev - 1);
      } else {
        await db.posts.like(post.id, currentUserId);
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleReaction = async (reactionType: string) => {
    try {
      await db.posts.addReaction(post.id, currentUserId, reactionType);
      setReaction(reactionType);
      setShowReactionPicker(false);
      toast.success(`Reacted with ${reactionType}!`);
    } catch (error) {
      toast.error('Failed to add reaction');
    }
  };

  const handleSave = async () => {
    try {
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Post removed from saved' : 'Post saved!');
    } catch (error) {
      toast.error('Failed to save post');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${postData.username}`,
        text: postData.content,
        url: `${window.location.origin}/post/${post.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    try {
      await db.posts.delete(post.id);
      onDelete?.(post.id);
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleArchive = async () => {
    try {
      await db.posts.archive(post.id);
      onDelete?.(post.id);
      toast.success('Post archived');
    } catch (error) {
      toast.error('Failed to archive post');
    }
  };

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${postData.username}`}>
            <Avatar src={postData.avatar_url} alt={postData.username} />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <Link
                href={`/profile/${postData.username}`}
                className="font-semibold hover:underline"
              >
                {postData.full_name}
              </Link>
              {postData.is_verified && (
                <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
              )}
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(postData.created_at), { addSuffix: true })}
              </span>
              <span className="text-gray-400">
                {visibilityIcons[postData.visibility]}
              </span>
            </div>
            <p className="text-sm text-gray-500">@{postData.username}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {post.user_id === currentUserId ? (
              <>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit post
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleArchive}>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem>Report post</DropdownMenuItem>
                <DropdownMenuItem>Hide post</DropdownMenuItem>
                <DropdownMenuItem>Unfollow @{postData.username}</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-2">
        <p className="whitespace-pre-wrap">{postData.content}</p>
        {postData.tags && postData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {postData.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/hashtag/${tag}`}
                className="text-blue-500 hover:underline text-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Post Media */}
      {postData.media_urls && postData.media_urls.length > 0 && (
        <div
          className={`grid ${
            postData.media_urls.length === 1
              ? 'grid-cols-1'
              : postData.media_urls.length === 2
              ? 'grid-cols-2'
              : 'grid-cols-3'
          } gap-1`}
        >
          {postData.media_urls.map((url: string, index: number) => (
            <div
              key={index}
              className={`relative ${
                postData.media_urls.length === 1 ? 'h-96' : 'h-48'
              }`}
            >
              {!imageError[index] ? (
                <Image
                  src={url}
                  alt={`Post media ${index + 1}`}
                  fill
                  className="object-cover cursor-pointer hover:opacity-95 transition"
                  onError={() => handleImageError(index)}
                  unoptimized={url.startsWith('https://picsum.photos')}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Image failed to load</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="font-medium">{likesCount} likes</span>
            <span className="text-gray-500">{postData.comments_count} comments</span>
          </div>
          {reaction && (
            <span className="text-sm text-gray-500">
              You reacted with {reaction}
            </span>
          )}
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-around">
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 ${isLiked ? 'text-red-500' : ''}`}
            onClick={handleLike}
            onMouseEnter={() => setShowReactionPicker(true)}
            onMouseLeave={() => setShowReactionPicker(false)}
          >
            <Heart
              className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`}
            />
            Like
          </Button>
          <AnimatePresence>
            {showReactionPicker && (
              <ReactionPicker
                onSelect={handleReaction}
                onClose={() => setShowReactionPicker(false)}
              />
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Comment
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`flex-1 ${isSaved ? 'text-blue-500' : ''}`}
          onClick={handleSave}
        >
          <Bookmark
            className={`h-5 w-5 mr-2 ${isSaved ? 'fill-current' : ''}`}
          />
          Save
        </Button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <Comments
            postId={post.id}
            currentUserId={currentUserId}
            onClose={() => setShowComments(false)}
          />
        )}
      </AnimatePresence>
    </motion.article>
  );
}