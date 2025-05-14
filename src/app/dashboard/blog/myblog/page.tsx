"use client";
import React from "react";
import SharedBlog from "./sharedblog/page";
import PublicBlog from "./blogbyme/page";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Share2 } from "lucide-react";

const BlogDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Tabs defaultValue="my-articles" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Article Management
            </h1>
            <p className="text-muted-foreground">
              View and manage your articles
            </p>
          </div>

          <TabsList className="grid w-full sm:w-auto grid-cols-2 h-12 bg-muted p-1 rounded-lg">
            <TabsTrigger
              value="my-articles"
              className="rounded-md flex items-center gap-2 data-[state=active]:shadow-sm"
            >
              <FileText className="h-4 w-4" />
              <span>My Articles</span>
            </TabsTrigger>
            <TabsTrigger
              value="shared-articles"
              className="rounded-md flex items-center gap-2 data-[state=active]:shadow-sm"
            >
              <Share2 className="h-4 w-4" />
              <span>Shared Articles</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="rounded-lg border bg-background p-6 shadow-sm">
          <TabsContent value="my-articles" className="m-0">
            <PublicBlog />
          </TabsContent>
          <TabsContent value="shared-articles" className="m-0">
            <SharedBlog />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default BlogDashboard;
