"use client";

import React, { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogHoverCard from "@/components/BlogHoverCard";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Share2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface BlogItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author?: string;
}

interface BlogData {
  blog: BlogItem[];
  allowedBlog: BlogItem[];
}

const SharedBlog = () => {
  const [data, setData] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/blog");
        setData(response.data.user);
      } catch (error) {
        toast.error("Failed to load shared articles");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/blog/${id}`);
    setCopiedId(id);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-6xl mx-auto">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
            <div className="p-4">
              <Skeleton className="h-9 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {data?.allowedBlog.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full">
            <span className="text-4xl">📬</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            No shared articles yet
          </h2>
          <p className="text-muted-foreground max-w-md">
            When someone shares an article with you, it will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">
              Shared With Me
            </h1>
            <p className="text-muted-foreground">
              {data?.allowedBlog.length}{" "}
              {data?.allowedBlog.length === 1 ? "article" : "articles"} shared
              with you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {data?.allowedBlog.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">
                    {article.title}
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(article.createdAt), "MMM d, yyyy")}
                    </p>
                    {article.author && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {article.author}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground line-clamp-3">
                  {article.content.slice(0, 200) +
                    (article.content.length > 200 ? "..." : "")}
                </CardContent>
                <div className="p-4 flex justify-between items-center border-t">
                  <BlogHoverCard id={article.id} action="Read Full Article" />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(article.id)}
                      className={
                        copiedId === article.id
                          ? "bg-green-50 text-green-600"
                          : ""
                      }
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {/* <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => router.push(`/blog/${article.id}`)}
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SharedBlog;
