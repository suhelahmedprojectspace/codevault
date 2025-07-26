'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/blog/${id}`);
        const blog = res.data.getBlog;
        setTitle(blog.title);
        setContent(blog.content);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load blog');
      }
    };
    if (id) fetchBlog();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`/blog/${id}`, { title, content });
      toast.success('Blog updated!');
      setTitle(' ');
      setContent(' ');
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Blog</CardTitle>
          <CardDescription>Update your blog post details below.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content here..."
                rows={10}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
