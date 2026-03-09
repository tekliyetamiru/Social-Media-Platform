// app/(dashboard)/user/explore/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Hash, Users, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { ExploreGrid } from './components/ExploreGrid';
import { TrendingHashtags } from './components/TrendingHashtags';
import { SuggestedUsers } from './components/SuggestedUsers';
import { SearchResults } from './components/SearchResults';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('for-you');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users, posts, or hashtags..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {debouncedQuery ? (
          // Search Results
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SearchResults query={debouncedQuery} />
          </motion.div>
        ) : (
          // Explore Content
          <>
            {/* Categories */}
            <div className="flex items-center justify-center space-x-4 mb-8 overflow-x-auto pb-2">
              {[
                { id: 'for-you', label: 'For You', icon: TrendingUp },
                { id: 'trending', label: 'Trending', icon: Hash },
                { id: 'people', label: 'People', icon: Users },
                { id: 'photos', label: 'Photos', icon: ImageIcon },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition ${
                    activeTab === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <ExploreGrid category={activeTab} />
              </div>
              <div className="lg:col-span-4 space-y-6">
                <TrendingHashtags />
                <SuggestedUsers />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}