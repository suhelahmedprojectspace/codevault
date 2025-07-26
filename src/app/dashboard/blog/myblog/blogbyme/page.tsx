'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BlogHoverCard from '@/components/BlogHoverCard';
import DeleteCard from '@/components/DeleteCard';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Edit2, Trash2, Plus } from 'lucide-react';

interface BlogItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

interface BlogData {
  blog: BlogItem[];
  allowedBlog: BlogItem[];
}

const PublicBlog = () => {
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/blog');
        setData(response.data.user);
      } catch (error) {
        toast.error('Failed to load articles');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await axios.delete(`/blog/${deleteId}`);
      if (res.status === 200) {
        toast.success('Article deleted successfully');
        setData((prev) =>
          prev
            ? {
                ...prev,
                blog: prev.blog.filter((item) => item.id !== deleteId),
              }
            : null,
        );
      }
    } catch (error) {
      toast.error('Failed to delete article');
      console.error(error);
    } finally {
      setDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
            <div className="p-4 flex justify-between">
              <Skeleton className="h-9 w-24" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-9" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {data?.blog.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full">
            <span className="text-4xl">📝</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">No articles published yet</h2>
          <p className="text-muted-foreground max-w-md">
            Share your knowledge with the world by creating your first article.
          </p>
          <Button onClick={() => router.push('/dashboard/blog/createblog')} className="gap-2 mt-4">
            <Plus className="w-4 h-4" />
            Create Article
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">My Articles</h1>
              <p className="text-muted-foreground">
                {data?.blog.length} {data?.blog.length === 1 ? 'article' : 'articles'} published
              </p>
            </div>
            <Button onClick={() => router.push('/dashboard/blog/createblog')} className="gap-2">
              <Plus className="w-4 h-4" />
              New Article
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {data?.blog.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">{article.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(article.createdAt), 'MMM d, yyyy')}
                    {article.updatedAt && article.updatedAt !== article.createdAt && (
                      <span className="text-xs ml-2">(edited)</span>
                    )}
                  </p>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground line-clamp-3">
                  {article.content.slice(0, 200) + (article.content.length > 200 ? '...' : '')}
                </CardContent>
                <div className="p-4 flex justify-between items-center border-t">
                  <BlogHoverCard id={article.id} action="Read More" />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push(`/dashboard/blog/editblog/${article.id}`)}
                      className="text-blue-600 hover:bg-blue-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <DeleteCard
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
        // title="Delete Article"
        // description="Are you sure you want to delete this article? This action cannot be undone."
      />
    </div>
  );
};

export default PublicBlog;
