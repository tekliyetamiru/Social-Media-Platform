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
  Camera,
  Instagram,
  Twitter,
  Github,
  Facebook,
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
  const [coverImage, setCoverImage] = useState(user.cover_url || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200');
  const [avatarImage, setAvatarImage] = useState(user.avatar_url || 'https://i.pravatar.cc/300');
  const isOwnProfile = currentUserId === user.id;

  const socialLinks = [
    { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
    { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { icon: Github, href: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
    { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
  ];

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
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Cover Image with Gradient Overlay */}
      <div className="relative h-64 md:h-80 group">
        <Image
          src={coverImage}
          alt="Cover"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {isOwnProfile && (
          <label className="absolute bottom-4 right-4 cursor-pointer z-10">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
            />
            <div className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 backdrop-blur-sm">
              <Camera className="h-4 w-4" />
              Change Cover
            </div>
          </label>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6 relative">
        {/* Avatar - Positioned to overlap cover */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 mb-4">
          <div className="flex items-end space-x-4">
            <div className="relative group">
              <Avatar
                src={avatarImage}
                alt={user.username}
                size="xl"
                className="border-4 border-white dark:border-gray-800 shadow-xl"
              />
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <div className="bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition transform hover:scale-110">
                    <Camera className="h-4 w-4" />
                  </div>
                </label>
              )}
            </div>
            <div className="mb-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.full_name || user.username}
                </h1>
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

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            {isOwnProfile ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)} className="shadow-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="shadow-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Account Settings</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                    <DropdownMenuItem>Your Activity</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                    <Button variant="outline" size="icon" className="shadow-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Report User</DropdownMenuItem>
                    <DropdownMenuItem>Block User</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Hide Profile</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {user.bio}
            </p>
          </motion.div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {user.location && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2 text-purple-500" />
              <span className="text-sm">{user.location}</span>
            </div>
          )}
          {user.website && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <LinkIcon className="h-4 w-4 mr-2 text-purple-500" />
              <a
                href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 hover:underline"
              >
                {user.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {user.email && !user.is_private && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4 mr-2 text-purple-500" />
              <a href={`mailto:${user.email}`} className="text-sm hover:underline">
                {user.email}
              </a>
            </div>
          )}
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2 text-purple-500" />
            <span className="text-sm">
              Joined {format(new Date(user.created_at), 'MMMM yyyy')}
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-3">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              className={`p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 ${social.color} transition transform hover:scale-110`}
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}