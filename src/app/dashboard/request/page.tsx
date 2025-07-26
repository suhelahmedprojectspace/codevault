'use client';
import React, { useEffect, useState } from 'react';
import SnippetRequest from './snippet/SnippetRequest';
import BlogRequest from './blog/BlogRequest';
import CodeBuddyRequest from './codebuddyrequest/page';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import axios from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; // Import Button component
export default function RequestDashboard() {
  const [snippetCount, setSnippetCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'snippets' | 'blogs' | 'buddy'>('snippets');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCount = async () => {
    try {
      const res = await axios.get(`/notifications`);
      setSnippetCount(res.data.snippetCount);
      setBlogCount(res.data.blogCount);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to fetch notification counts', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleTabChange = async (value: string) => {
    if (value !== 'snippets' && value !== 'blogs' && value !== 'buddy') return;

    setIsLoading(true);
    setActiveTab(value);

    try {
      const type = value === 'snippets' ? 'SNIPPET' : 'BLOG';
      await axios.put(`/notifications/mark-read?type=${type}`);

      if (type === 'SNIPPET') {
        setSnippetCount(0);
      } else {
        setBlogCount(0);
      }
    } catch (err) {
      console.error(`Failed to mark notifications as read`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    setIsLoading(true);
    try {
      await axios.put('/notifications');
      setSnippetCount(0);
      setBlogCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-4">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="flex flex-wrap gap-2 w-full rounded-lg p-1 h-auto">
                <TabsTrigger
                  value="snippets"
                  className="relative rounded-md transition-all duration-200 hover:bg-muted/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    Snippet Requests
                    {snippetCount !== null && snippetCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 p-0 flex items-center justify-center"
                      >
                        {snippetCount}
                      </Badge>
                    )}
                    {isLoading && activeTab === 'snippets' && (
                      <Skeleton className="h-4 w-4 rounded-full" />
                    )}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="blogs"
                  className="relative rounded-md transition-all duration-200 hover:bg-muted/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    Blog Requests
                    {blogCount !== null && blogCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 p-0 flex items-center justify-center animate-bounce"
                      >
                        {blogCount}
                      </Badge>
                    )}
                    {isLoading && activeTab === 'blogs' && (
                      <Skeleton className="h-4 w-4 rounded-full" />
                    )}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="buddy"
                  className="relative rounded-md transition-all duration-200 hover:bg-muted/50"
                >
                  <span className="flex items-center justify-center gap-2">
                    Buddy Requests
                    {/* {blogCount !== null && blogCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 p-0 flex items-center justify-center animate-bounce"
                      >
                        {blogCount}
                      </Badge>
                    )} */}
                    {isLoading && activeTab === 'buddy' && (
                      <Skeleton className="h-4 w-4 rounded-full" />
                    )}
                  </span>
                </TabsTrigger>
              </TabsList>

              {(snippetCount !== null && snippetCount > 0) ||
              (blogCount !== null && blogCount > 0) ? (
                <Button variant="outline" onClick={markAllAsRead} disabled={isLoading}>
                  Mark All as Read
                </Button>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <TabsContent value="snippets">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <SnippetRequest />
              )}
            </TabsContent>

            <TabsContent value="blogs">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <BlogRequest />
              )}
            </TabsContent>

            <TabsContent value="buddy">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <CodeBuddyRequest />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
