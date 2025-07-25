"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  Heart,
  ClipboardList,
  Code,
  FileText,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import axios from "@/lib/axios";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    comments: 0,
    likes: 0,
    requests: 0,
    snippets: 0,
    blogs: 0,
    loading: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));
      const response=await axios.get('/account/count');
       const { commentCount, _count } = response.data;

    setStats({
      comments: commentCount || 0,
      likes: _count?.likes || 0,
      requests: 0, // You can update this if you have real request data
      snippets: _count?.snippetCollection || 0,
      blogs: _count?.blog || 0,
      loading: false,
    });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  if (status === "loading" || stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 button-hover-rotate"
              onClick={() => router.push("/dashboard/account")}
            >
              <Settings className="h-4 w-4 icon-rotate" />
              <span>Settings</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back,{" "}
            <span className="text-primary">{session?.user?.name}</span>
          </h2>
          <p className="text-gray-600">
            Here's your activity overview.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Comments
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="items-center justify-center flex flex-col ">
              <div className="text-2xl font-bold">{stats.comments}</div>
              <p className="text-xs text-muted-foreground text-center">
                Your recent interactions
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Likes
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent  className="items-center justify-center flex flex-col ">
              <div className="text-2xl font-bold">{stats.likes}</div>
              <p className="text-xs text-muted-foreground text-center">
                Received on your content
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requests</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent  className="items-center justify-center flex flex-col ">
              <div className="text-2xl font-bold">{stats.requests}</div>
              <p className="text-xs text-muted-foreground text-center">
                Pending collaborations
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer" >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Snippets</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent  className="items-center justify-center flex flex-col ">
              <div className="text-2xl font-bold">{stats.snippets}</div>
              <p className="text-xs text-muted-foreground text-center">
                Your code snippets
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blogs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent  className="items-center justify-center flex flex-col ">
              <div className="text-2xl font-bold">{stats.blogs}</div>
              <p className="text-xs text-muted-foreground text-center">
                Your published articles
              </p>
            </CardContent>
          </Card>
        </div>

      
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="rounded-full bg-gray-100 p-2">
                <User className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium">{session?.user?.name}</h3>
                <p className="text-sm text-gray-600">{session?.user?.email}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/account')}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}