'use client';

import { useState } from 'react';
import { Image, Video, Smile, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { toast } from 'react-hot-toast';

interface CreatePostProps {
  user: any;
}

export function CreatePost({ user }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && selectedFiles.length === 0) return;

    try {
      // TODO: Implement post creation
      toast.success('Post created successfully!');
      setContent('');
      setSelectedFiles([]);
      setIsExpanded(false);
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-3">
          <Avatar src={user.avatar_url} alt={user.username} size="md" />
          <div className="flex-1">
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:border-gray-600"
              rows={isExpanded ? 3 : 1}
            />

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <Video className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            {isExpanded && (
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="image-upload"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
                  >
                    <Image className="h-5 w-5 text-gray-500" />
                  </label>

                  <input
                    type="file"
                    id="video-upload"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="video-upload"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
                  >
                    <Video className="h-5 w-5 text-gray-500" />
                  </label>

                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <Smile className="h-5 w-5 text-gray-500" />
                  </button>

                  <button
                    type="button"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                  >
                    <MapPin className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <Button type="submit" disabled={!content.trim() && selectedFiles.length === 0}>
                  Post
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}