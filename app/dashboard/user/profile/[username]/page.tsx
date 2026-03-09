// app/(dashboard)/user/profile/[username]/page.tsx
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/auth';
import { db } from '@/lib/db/queries';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileTabs } from './components/ProfileTabs';
import { ProfileSidebar } from './components/ProfileSidebar';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  
  // Fetch user profile
  const user = await db.users.findByUsername(params.username);
  
  if (!user) {
    notFound();
  }

  // Check if current user can view this profile
  if (user.is_private && session?.user.id !== user.id) {
    const isFollowing = await db.users.isFollowing(session?.user.id, user.id);
    if (!isFollowing) {
      redirect(`/profile/${params.username}/private`);
    }
  }

  // Fetch user posts
  const posts = await db.posts.getUserPosts(user.id, session?.user.id, 12, 0);
  
  // Fetch followers and following counts
  const followersCount = await db.users.getFollowersCount(user.id);
  const followingCount = await db.users.getFollowingCount(user.id);
  
  // Check if current user is following
  const isFollowing = session ? await db.users.isFollowing(session.user.id, user.id) : false;
  
  // Fetch user's close friends status
  const isCloseFriend = session ? await db.users.isCloseFriend(user.id, session.user.id) : false;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <ProfileHeader 
          user={user}
          currentUserId={session?.user.id}
          postsCount={posts.length}
          followersCount={followersCount}
          followingCount={followingCount}
          isFollowing={isFollowing}
          isCloseFriend={isCloseFriend}
        />

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <div className="lg:col-span-8">
            <ProfileTabs 
              userId={user.id}
              username={user.username}
              initialPosts={posts}
              currentUserId={session?.user.id}
            />
          </div>
          <div className="lg:col-span-4">
            <ProfileSidebar user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}

// app/(dashboard)/user/profile/[username]/components/ProfileHeader.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Mail,
  MoreHorizontal,
  UserPlus,
  UserCheck,
  Star,
  Settings,
  Lock,
  Globe,
  MessageCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { FollowButton } from './FollowButton';
import { CloseFriendButton } from './CloseFriendButton';
import { MessageButton } from './MessageButton';
import { toast } from 'react-hot-toast';

interface ProfileHeaderProps {
  user: any;
  currentUserId?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isCloseFriend: boolean;
}

export function ProfileHeader({
  user,
  currentUserId,
  postsCount,
  followersCount,
  followingCount,
  isFollowing,
  isCloseFriend,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [coverImage, setCoverImage] = useState(user.cover_url);
  const [avatarImage, setAvatarImage] = useState(user.avatar_url);
  const isOwnProfile = currentUserId === user.id;

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'cover');

      const response = await fetch('/api/users/upload-cover', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCoverImage(data.url);
        toast.success('Cover image updated!');
      }
    } catch (error) {
      toast.error('Failed to upload cover image');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');

      const response = await fetch('/api/users/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarImage(data.url);
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      toast.error('Failed to upload profile picture');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-purple-500 to-pink-500">
        {coverImage && (
          <Image
            src={coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
        {isOwnProfile && (
          <label className="absolute bottom-4 right-4 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
            />
            <div className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium transition">
              Change Cover
            </div>
          </label>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 sm:px-6 pb-6">
        {/* Avatar and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-12 mb-4">
          <div className="flex items-end space-x-4">
            <div className="relative">
              <Avatar
                src={avatarImage}
                alt={user.username}
                size="xl"
                className="border-4 border-white dark:border-gray-800"
              />
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <div className="bg-primary text-white p-1.5 rounded-full shadow-lg hover:bg-primary/90 transition">
                    <Camera className="h-4 w-4" />
                  </div>
                </label>
              )}
            </div>
            <div className="mb-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold">{user.full_name || user.username}</h1>
                {user.is_verified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Verified
                  </Badge>
                )}
                {user.is_private && (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            {isOwnProfile ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <FollowButton
                  userId={user.id}
                  initialIsFollowing={isFollowing}
                />
                <MessageButton userId={user.id} />
                {isFollowing && (
                  <CloseFriendButton
                    userId={user.id}
                    initialIsCloseFriend={isCloseFriend}
                  />
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report User</DropdownMenuItem>
                    <DropdownMenuItem>Block User</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Hide Profile
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center space-x-6 mb-4">
          <div>
            <span className="font-bold">{postsCount}</span>
            <span className="text-gray-500 ml-1">posts</span>
          </div>
          <Link href={`/profile/${user.username}/followers`} className="hover:underline">
            <span className="font-bold">{followersCount}</span>
            <span className="text-gray-500 ml-1">followers</span>
          </Link>
          <Link href={`/profile/${user.username}/following`} className="hover:underline">
            <span className="font-bold">{followingCount}</span>
            <span className="text-gray-500 ml-1">following</span>
          </Link>
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          {user.location && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {user.location}
            </div>
          )}
          {user.website && (
            <div className="flex items-center">
              <LinkIcon className="h-4 w-4 mr-1" />
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {user.email && !user.is_private && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <a href={`mailto:${user.email}`} className="hover:underline">
                {user.email}
              </a>
            </div>
          )}
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Joined {format(new Date(user.created_at), 'MMMM yyyy')}
          </div>
        </div>
      </div>
    </motion.div>
  );
}