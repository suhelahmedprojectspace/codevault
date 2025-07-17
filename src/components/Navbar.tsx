"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "@/lib/axios";
import { Bell, LayoutDashboard, LogOut, Menu, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import OnlineStatus from "./OnlineStatus";
interface NavbarProps {
  className?: string;
}

interface Notification {
  id: string;
  sender: { username?: string; image?: string };
  snippet?: { title: string };
  blog?: { title: string };
  type: string;
  isRead: boolean;
  createdAt: string;
}

const Navbar = ({ className }: NavbarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
 const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null);
  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [showimage, setShowimag] = useState("");
  const [hasMatchingPreferences, setHasMatchingPreferences] = useState<boolean | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

   const fetchUserStatus = async () => {
    try {
      const res = await axios.get("/porfolio/check");
      setHasPortfolio(res.data.hasPortfolio);
      setHasMatchingPreferences(res.data.hasmatchingPreferences);
    } catch (error) {
      console.error("Error fetching user status:", error);
    }
  };

  const fetchUser = async () => {
    if (user) {
      try {
        const res = await axios.get("/user");
        const user = await axios.get("/account");
        setShowimag(user.data.user.image);
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session?.user?.id);
      fetchUserStatus();
    }
  }, [session, status]);

  useEffect(() => {
    fetchUser();
    const interval=setInterval(()=>{
      fetchUser();
      fetchUserStatus();
    },30_000)
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setDropDownVisible(false);
      }
      if (
        notifyRef.current &&
        !notifyRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // useEffect(() => {
  //   const checkuserporfolio = async () => {
  //     const response = await axios.get("/porfolio/check");
  //     setShowprofile(response.data.hasPortfolio);
  //     setHasMatchingPreferences(response.data.hasmatchingPreferences);
  //   };
  //   checkuserporfolio();
  // }, []);

  const showNavbar = !pathname.startsWith("/dashboard");
  if (!showNavbar) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotify = (e: React.MouseEvent) => {
    e.preventDefault();
    setNotifOpen((prev) => !prev);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const typeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "snippet":
        return "bg-blue-100 text-blue-800 font-semibold";
      case "blog":
        return "bg-green-100 text-green-800 font-semibold";
      case "connection":
        return "bg-yellow-100 text-yellow-800 font-semibold";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("/notifications");
      fetchUser();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(`/notifications/${id}`);
      fetchUser();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <nav
      className={cn(
        "bg-white dark:bg-gray-900 fixed w-full z-20 top-0 border-b border-gray-200 dark:border-gray-600",
        className,
      )}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Menu onClick={() => setShow(true)} className="lg:hidden md:hidden" />
        {show && (
          <div
            onClick={() => setShow(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
          />
        )}
        <div
          className={`fixed top-0 left-0 h-full w-60 bg-white dark:bg-gray-900 z-40 border-r p-4 shadow-md transition-transform duration-300 ${show ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold text-xl shadow">
                <span className="relative">
                  CV
                  <span className="absolute -right-1 -top-1 w-1.5 h-1.5 bg-secondary rounded-full border border-white"></span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setShow(false)}
              className="font-semibold text-xl font-mono text-red-600"
            >
              X
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <Link
              href="/snippets"
              className="p-2 font-medium hover:bg-zinc-200 dark:hover:bg-gray-700 rounded"
            >
              Code Snippets
            </Link>
            <Link
              href="/blogs"
              className="p-2 font-medium hover:bg-zinc-200 dark:hover:bg-gray-700 rounded"
            >
              Technical Blogs
            </Link>
            <Link
              href="/interview"
              className="p-2 font-medium hover:bg-zinc-200 dark:hover:bg-gray-700 rounded"
            >
              Interview Prep
            </Link>
            
            <Link
              href={hasPortfolio ? "/portfolio/userprofile" : "/portfolio"}
              className="p-2 font-medium hover:bg-zinc-200 dark:hover:bg-gray-700 rounded"
            >
              {hasPortfolio ? "My Portfolio" : "Create Portfolio"}
            </Link>
            <Link
              href={hasMatchingPreferences ? "/recommendation" : "/codebuddy"}
              className="p-2 font-medium hover:bg-zinc-200 dark:hover:bg-gray-700 rounded"
            >
              {hasMatchingPreferences ? "Matched Developers" : "Find Your Code Buddy"}
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/" className="hidden md:flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white font-bold text-xl shadow">
              <span className="relative">
                CV
                <span className="absolute -right-1 -top-1 w-1.5 h-1.5 bg-secondary rounded-full border border-white"></span>
              </span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center space-x-6 ms-3">
            <Link href="/snippets" className="hover:text-blue-500 font-medium">
              Code Snippets
            </Link>
            <Link href="/blogs" className="hover:text-blue-500 font-medium">
              Technical Blogs
            </Link>
            <Link href="/interview" className="hover:text-blue-500 font-medium">
              Interview Prep
            </Link>
           <Link
              href={hasPortfolio ? "/portfolio/userprofile" : "/portfolio"}
              className="p-2 font-medium hover:bg-zinc-200 dark:hover:bg-gray-700 rounded"
            >
              {hasPortfolio ? "My Portfolio" : "Create Portfolio"}
            </Link>
            <Link
              href={hasMatchingPreferences ? "/recommendation" : "/codebuddy"}
              className="p-2 font-medium hover:bg-zinc-200 dark:hover:bg-gray-700 rounded"
            >
                {hasMatchingPreferences ? "Matched Developers" : "Find Your Code Buddy"}
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <div className="relative" ref={notifyRef}>
                <button className="relative" onClick={handleNotify}>
                  <Bell className="text-gray-700 dark:text-gray-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <div
                  className={`absolute top-8 right-0 w-96 transition-all duration-300 origin-top ${notifOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"} bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 rounded-md z-50`}
                >
                  <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-blue-600 hover:underline flex items-center space-x-1"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>Mark all as read</span>
                      </Button>
                    )}
                  </div>
                  {unreadCount === 0 ? (
                    <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications
                      .filter((n) => !n.isRead)
                      .map((data) => (
                        <Card
                          key={data.id}
                          className="border-none shadow-none hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <CardContent className="p-4 text-sm space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold capitalize text-gray-800 dark:text-white">
                                {data.sender.username}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${typeBadgeColor(data.type)}`}
                              >
                                {data.type}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-gray-600 dark:text-gray-300 lowercase">
                                {data.type === "MESSAGE" ? (
    <>You have a new message.</>
  ) : session?.user?.id === data.sender ? (
    <>has accepted your {data.type} request.</>
  ) : (
    <>sent you a new {data.type} request.</>
  )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(data.id)}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Mark as read
                              </Button>
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(data.createdAt)}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </div>

              <div className="relative" ref={dropDownRef}>
               {session?.user.id && 
               <OnlineStatus userId={session.user.id} />}
                <Avatar
                  onClick={() => setDropDownVisible((prev) => !prev)}
                  className="cursor-pointer"
                >
                  <AvatarImage
                    src={showimage || "https://github.com/shadcn.png"}
                    alt="User"
                    className="object-cover"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                {dropDownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg dark:bg-gray-800 border dark:border-gray-600 rounded">
                    <Card>
                      <CardContent className="p-4 space-y-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <hr className="dark:border-gray-600" />
                        <button
                          onClick={() => signOut()}
                          className="flex items-center space-x-2 w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button onClick={() => router.push("/login")}>Sign In</Button>
              <Button variant="outline" onClick={() => router.push("/signup")}>
                Create Account
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
