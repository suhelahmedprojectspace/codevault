'use client';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { Lock, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface Blog {
  id: string;
  title: string;
  content: string;
  visibilty: string;
  createdAt: string;
  allowedUsers: { id: string }[];
  author: {
    id: string;
    username: string;
    image: string;
  };
}

const LIMIT = 6;

const Page = () => {
  const router = useRouter();
  const [userid, setUserid] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/blog/available?page=${page}&limit=${LIMIT}`);
        setTotalBlogs(res.data.total);
        setBlogs(res.data.blogs);
      } catch (error) {
        toast.error('Failed to load blogs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, userid]);

  useEffect(() => {
    if (status === 'authenticated') {
      setUserid(session?.user?.id || null);
    }
  }, [session, status]);

  const totalPage = Math.ceil(totalBlogs / LIMIT);

  const handleRequest = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (status === 'unauthenticated') {
      toast.error('Please login to access this feature.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    try {
      const res = await axios.post('/blog/request', { blogId: id });
      if (res.status === 201) {
        toast.success('Access request sent!');
        setRequestedIds((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error('Request error:', error);
      toast.error('Failed to send request');
    }
  };

  return (
    <div className="flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center"
      >
        Latest Technical Insights
      </motion.h1>

      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: LIMIT }).map((_, i) => (
                <Card key={i} className="h-[350px]">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-4/5" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-4 w-1/2" />
                  </CardFooter>
                </Card>
              ))
            : blogs.map((blog, index) => {
                const isPrivate = blog.visibilty === 'private';
                const isAuthor = blog.author.id === userid;
                const isAllowed = blog.allowedUsers?.some((user) => user.id === userid);
                const showRequestUI = isPrivate && !isAuthor && !isAllowed;

                return (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group relative h-full hover:shadow-lg transition-shadow duration-200 border-gray-100 dark:border-gray-800">
                      <CardHeader className="pb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={blog.author?.image} />
                            <AvatarFallback>
                              {blog.author?.username?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                              {blog.author?.username || 'Unknown'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(blog.createdAt))} ago
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-4">
                        <CardTitle className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                          {blog.title}
                        </CardTitle>

                        <div className="relative">
                          {showRequestUI ? (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-gray-900 z-10" />
                              <p className="text-gray-600 dark:text-gray-300 line-clamp-4 blur-sm select-none">
                                {blog.content}
                              </p>
                              <div className="absolute inset-0 flex items-center justify-center z-20">
                                <Button
                                  variant="destructive"
                                  onClick={(e) => handleRequest(e, blog.id)}
                                  disabled={requestedIds.includes(blog.id)}
                                  className="shadow-lg px-6 py-3"
                                >
                                  <Lock className="w-4 h-4 mr-2" />
                                  {requestedIds.includes(blog.id)
                                    ? 'Request Sent'
                                    : 'Request Access'}
                                </Button>
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-4">
                              {blog.content}
                            </p>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          {formatDistanceToNow(new Date(blog.createdAt))} ago
                        </div>
                        {!showRequestUI && (
                          <Link
                            href={`/blogs/${blog.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Read More
                          </Link>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-12">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="min-w-[100px]"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Page {page} of {totalPage}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(totalPage, page + 1))}
            disabled={page === totalPage}
            className="min-w-[100px]"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
