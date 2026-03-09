'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Filter,
  Search,
  Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { toast } from 'react-hot-toast';

interface Report {
  id: string;
  type: 'post' | 'comment' | 'user';
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  reporter: {
    username: string;
    avatar_url: string;
  };
  reported_user?: {
    username: string;
  };
  content?: string;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Mock data instead of API call
    setTimeout(() => {
      setReports([
        {
          id: '1',
          type: 'post',
          reason: 'Inappropriate content',
          description: 'This post contains offensive language',
          status: 'pending',
          created_at: new Date().toISOString(),
          reporter: { username: 'user123', avatar_url: '' },
          reported_user: { username: 'offender' },
          content: 'This is the reported content...',
        },
        {
          id: '2',
          type: 'comment',
          reason: 'Spam',
          description: 'Repeated spam comments',
          status: 'pending',
          created_at: new Date().toISOString(),
          reporter: { username: 'user456', avatar_url: '' },
          reported_user: { username: 'spammer' },
          content: 'Check out my website...',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleResolve = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    toast.success('Report resolved');
  };

  const handleDismiss = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    toast.success('Report dismissed');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Moderation Queue</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="post">Posts</SelectItem>
            <SelectItem value="comment">Comments</SelectItem>
            <SelectItem value="user">Users</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline">Apply Filters</Button>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((report) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar src={report.reporter.avatar_url} alt={report.reporter.username} size="sm" />
                    <div>
                      <p className="font-medium">Reported by @{report.reporter.username}</p>
                      <p className="text-xs text-gray-500">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{report.type}</Badge>
                    <Badge variant="destructive">{report.status}</Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-red-500">Reason: {report.reason}</p>
                  {report.description && (
                    <p className="text-sm mt-1">{report.description}</p>
                  )}
                </div>

                {report.content && (
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded mb-4">
                    <p className="text-sm italic">"{report.content}"</p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDismiss(report.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Dismiss
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleResolve(report.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {reports.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No pending reports</h3>
              <p className="text-gray-500">All reports have been processed</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}