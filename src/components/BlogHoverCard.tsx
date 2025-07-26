import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import axios from '@/lib/axios';

interface BlogItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const BlogHoverCard = ({ id, action }: { id: string; action: string }) => {
  const [data, setData] = useState<BlogItem | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/blog/${id}`);
        setData(res.data.getBlog);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">{action}</Button>
      </DialogTrigger>
      {data ? (
        <DialogContent className="max-w-[425px] h-[auto] max-h-[500px] overflow-auto">
          <DialogHeader>
            <DialogTitle>{data.title}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm">{data.content}</DialogDescription>
        </DialogContent>
      ) : null}
    </Dialog>
  );
};

export default BlogHoverCard;
