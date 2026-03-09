'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Report {
  id: string;
  reporter: {
    username: string;
    avatar_url: string;
  };
  reported_user: {
    username: string;
  };
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
}

export function RecentReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setReports([
      {
        id: '1',
        reporter: { username: 'user1', avatar_url: '' },
        reported_user: { username: 'spammer123' },
        reason: 'Spam',
        status: 'pending',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        reporter: { username: 'user2', avatar_url: '' },
        reported_user: { username: 'harasser' },
        reason: 'Harassment',
        status: 'pending',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        reporter: { username: 'user3', avatar_url: '' },
        reported_user: { username: 'troll' },
        reason: 'Inappropriate content',
        status: 'resolved',
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ]);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
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
          Recent Reports
          <Badge variant="destructive">{reports.filter(r => r.status === 'pending').length} pending</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <Avatar src={report.reporter.avatar_url} alt={report.reporter.username} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-medium">@{report.reporter.username}</span>{' '}
                  reported{' '}
                  <span className="font-medium">@{report.reported_user.username}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Reason: {report.reason}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {report.status === 'pending' && (
                <Button size="sm" variant="outline">Review</Button>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}