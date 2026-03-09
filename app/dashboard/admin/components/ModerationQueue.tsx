'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'react-hot-toast';

interface ModerationItem {
  id: string;
  type: 'post' | 'comment' | 'user';
  content: string;
  reported_by: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export function ModerationQueue() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setItems([
      {
        id: '1',
        type: 'post',
        content: 'Inappropriate content here...',
        reported_by: 'user123',
        reason: 'Harassment',
        severity: 'high',
      },
      {
        id: '2',
        type: 'comment',
        content: 'Spam comment',
        reported_by: 'user456',
        reason: 'Spam',
        severity: 'medium',
      },
      {
        id: '3',
        type: 'user',
        content: 'User profile with inappropriate bio',
        reported_by: 'user789',
        reason: 'Inappropriate profile',
        severity: 'low',
      },
    ]);
    setLoading(false);
  }, []);

  const handleAction = (action: string, itemId: string) => {
    toast.success(`Item ${action} successfully`);
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Moderation Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Moderation Queue
          <Badge variant="destructive">{items.length} pending</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge className={getSeverityColor(item.severity)}>
                  {item.severity} priority
                </Badge>
                <Badge variant="outline">{item.type}</Badge>
              </div>
              <p className="text-sm mb-2 line-clamp-2">{item.content}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>Reported by @{item.reported_by}</span>
                <span>Reason: {item.reason}</span>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1"
                  onClick={() => handleAction('approved', item.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleAction('rejected', item.id)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction('hidden', item.id)}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}