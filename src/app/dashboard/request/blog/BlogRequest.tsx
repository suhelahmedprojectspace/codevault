"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import UserHoverCard from "@/components/UserHoverCard";
import { Check, X, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Blog {
  id: string;
  createdAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  blog: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
  };
  requester: {
    id: string;
    username: string;
    email: string;
    image: string;
  };
}

const BlogRequest = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/blog/request");
        setBlogs(response.data.request);
      } catch (error) {
        toast.error("Failed to fetch blog requests");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAction = async (id: string, action: "APPROVED" | "REJECTED") => {
    try {
      await axios.put("/blog/request", { requestId: id, status: action });
      setBlogs((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: action } : req)),
      );
      toast.success(
        action === "APPROVED"
          ? "Blog access approved successfully"
          : "Request rejected",
      );
    } catch (error) {
      toast.error("Action failed");
      console.error("Action error:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 w-full max-w-4xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-24" />
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
          <h1 className="text-2xl font-bold tracking-tight">
            Blog Access Requests
          </h1>
          <p className="text-muted-foreground">
            Manage requests to access your private blog posts
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center p-8 rounded-lg border border-dashed">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
            <Check className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium">No pending requests</h3>
          <p className="text-muted-foreground mt-1">
            You're all caught up on blog access requests.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{blog.blog.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Created:{" "}
                      {format(new Date(blog.blog.createdAt), "MMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      blog.status === "APPROVED"
                        ? "default"
                        : blog.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                    }
                    className="flex items-center gap-1"
                  >
                    {blog.status === "PENDING" && <Clock className="h-3 w-3" />}
                    {blog.status === "APPROVED" && (
                      <Check className="h-3 w-3" />
                    )}
                    {blog.status === "REJECTED" && <X className="h-3 w-3" />}
                    {blog.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Requested by:</span>
                    <UserHoverCard
                      email={blog.requester.email}
                      name={blog.requester.username}
                      image={blog.requester.image}
                    />
                  </div>
                  <span className="text-muted-foreground">
                    {format(new Date(blog.createdAt), "MMM d, yyyy - h:mm a")}
                  </span>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">
                    {expandedId === blog.blog.id
                      ? blog.blog.content
                      : `${blog.blog.content.slice(0, 200)}...`}
                  </p>
                </div>

                {blog.blog.content.length > 200 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-muted-foreground"
                    onClick={() =>
                      setExpandedId((prev) =>
                        prev === blog.blog.id ? null : blog.blog.id,
                      )
                    }
                  >
                    {expandedId === blog.blog.id ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        View Full Content
                      </>
                    )}
                  </Button>
                )}
              </CardContent>

              {blog.status === "PENDING" && (
                <CardFooter className="flex justify-end gap-2 bg-muted/50 p-4">
                  <Button
                    variant="outline"
                    onClick={() => handleAction(blog.id, "REJECTED")}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleAction(blog.id, "APPROVED")}
                    className="gap-2"
                  >
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

export default BlogRequest;
