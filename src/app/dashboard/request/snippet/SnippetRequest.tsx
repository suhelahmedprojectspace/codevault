'use client';

import axios from '@/lib/axios';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import UserHoverCard from '@/components/UserHoverCard';
import toast from 'react-hot-toast';
import { Check, X, Clock, Copy, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface Snippet {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  requester: {
    username: string;
    email: string;
    image: string;
  };
  snippet: {
    title: string;
    framework: string;
    description: string;
    content: string;
    visibility: 'public' | 'private';
    language: string;
  };
}

const SnippetRequest = () => {
  const [requests, setRequests] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await axios.get('/snippet/request');
      setRequests(res.data.request);
    } catch (error) {
      toast.error('Failed to load snippet requests');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      await axios.put('/snippet/request', { requestId: id, status: action });
      setRequests((prev) => prev.map((req) => (req.id === id ? { ...req, status: action } : req)));
      toast.success(action === 'APPROVED' ? 'Access granted successfully' : 'Request rejected');
    } catch (error) {
      toast.error('Action failed');
      console.error('Action error:', error);
    }
  };

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareRequest = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/snippet/request/${id}`);
    toast.success('Request link copied');
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full max-w-4xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Snippet Requests</h1>
          <p className="text-muted-foreground">Manage access requests for your code snippets</p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          Refresh
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center p-8 rounded-lg border border-dashed">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
            <Check className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium">No pending requests</h3>
          <p className="text-muted-foreground mt-1">
            You're all caught up on snippet access requests.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {request.snippet.title}
                      <Badge variant="outline">{request.snippet.framework}</Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {request.snippet.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      request.status === 'APPROVED'
                        ? 'default'
                        : request.status === 'REJECTED'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className="flex items-center gap-1"
                  >
                    {request.status === 'PENDING' && <Clock className="h-3 w-3" />}
                    {request.status === 'APPROVED' && <Check className="h-3 w-3" />}
                    {request.status === 'REJECTED' && <X className="h-3 w-3" />}
                    {request.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Requested by:</span>
                    <UserHoverCard
                      email={request.requester.email}
                      name={request.requester.username}
                      image={request.requester?.image}
                    />
                  </div>
                  <span className="text-muted-foreground">
                    {format(new Date(request.createdAt), 'MMM d, yyyy - h:mm a')}
                  </span>
                </div>

                <div className="relative">
                  <SyntaxHighlighter
                    language={request.snippet.language || 'javascript'}
                    style={atomOneDark}
                    customStyle={{
                      borderRadius: '0.5rem',
                      padding: '1rem',
                      fontSize: '0.875rem',
                    }}
                    showLineNumbers
                  >
                    {request.snippet.content}
                  </SyntaxHighlighter>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(request.snippet.content, request.id)}
                    >
                      <Copy
                        className={`h-4 w-4 ${copiedId === request.id ? 'text-green-500' : ''}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => shareRequest(request.id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>

              {request.status === 'PENDING' && (
                <CardFooter className="flex justify-end gap-2 bg-muted/50 p-4">
                  <Button
                    variant="outline"
                    onClick={() => handleAction(request.id, 'REJECTED')}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button onClick={() => handleAction(request.id, 'APPROVED')} className="gap-2">
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnippetRequest;
