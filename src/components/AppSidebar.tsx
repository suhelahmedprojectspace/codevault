"use client";
import {
  CodeXml,
  ChevronDown,
  NotebookPen,
  Bell,
  LogOut,
  Menu,
  Briefcase,
  CopyIcon,
  Share,
  CircleUserRound,
  MessageSquareText,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import ShareButton from "./ShareButton";
import { useSession } from "next-auth/react";
import { useNotifications } from "@/hooks/use-notification";
import toast from "react-hot-toast";
// import NotificationListener from "./NotificationListener";
export function AppSideBar({ closeSidebar }: { closeSidebar?: () => void }) {
  const session = useSession();
  // const [requestCount, setRequestCount] = useState(0);
  // const [snippetCount, setSnippetCount] = useState(0);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const { total ,
  fetchCounts
} = useNotifications();
  console.log(total);
 useEffect(() => {
    fetchCounts(); 
  }, [fetchCounts]);

  const [portfolioId, setPortfolioId] = useState("");
  // const [blogCount, setBlogCount] = useState(0);

  const fetchUserPortfolioStatus = async () => {
    try {
      const response = await axios.get("/porfolio/check");
      console.log(response.data.hasPortfolio);
      setHasPortfolio(response.data.hasPortfolio);
      setPortfolioId(response.data.portfolioId);
    } catch (error) {
      console.error("Error checking portfolio status:", error);
    }
  };

  useEffect(()=>{
    fetchUserPortfolioStatus();
  },[])

  // const handleNotificationClick = async () => {
  //   try {
  //     await axios.put("/notifications");
  //     setRequestCount(0);
  //   } catch (err) {
  //     console.error("Failed to mark all read", err);
  //   }
  // };

  
//   const handlePortfolioCreated = () => {
//     setHasPortfolio(true);
//     fetchUserPortfolioStatus(); 
// };

  
  return (
    <aside className="min-h-screen top-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out">
      <div className="h-full px-3 py-4 overflow-y-auto">
        {/* Header with Branding and Hamburger */}
        <div className="flex items-center justify-between mb-6 px-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold text-2xl shadow-sm">
              <span className="relative">
                CV
                <span className="absolute -right-1 -top-1 w-2 h-2 bg-blue-300 rounded-full"></span>
              </span>
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white hidden md:block">
              CodeVault
            </span>
          </Link>

          {closeSidebar && (
            <button
              onClick={closeSidebar}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center p-3 rounded-lg group",
              "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
              "transition-colors duration-200",
            )}
          >
            <svg
              className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span className="ms-3">Dashboard</span>
          </Link>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={cn(
                  "flex items-center justify-between w-full p-3 rounded-lg group",
                  "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                  "transition-colors duration-200",
                )}
              >
                <div className="flex items-center">
                  <CodeXml className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="ms-3">Snippets</span>
                </div>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="start"
              sideOffset={5}
              className={cn(
                "min-w-[200px] rounded-md shadow-lg bg-white dark:bg-gray-700",
                "border border-gray-200 dark:border-gray-600",
                "animate-in slide-in-from-top-2 z-10",
              )}
            >
              <DropdownMenu.Item className="p-0">
                <Link
                  href="/dashboard/snippet/createcode"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                >
                  Create Snippet
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="p-0">
                <Link
                  href="/dashboard/snippet/mysnippets"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                >
                  My Snippets
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="p-0">
                <Link
                  href="/dashboard/snippet/editsnippet"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                >
                  Edit Snippet
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                className={cn(
                  "flex items-center justify-between w-full p-3 rounded-lg group",
                  "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                  "transition-colors duration-200",
                )}
              >
                <div className="flex items-center">
                  <NotebookPen className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="ms-3">Blogs</span>
                </div>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              align="start"
              sideOffset={5}
              className={cn(
                "min-w-[200px] rounded-md shadow-lg bg-white dark:bg-gray-700",
                "border border-gray-200 dark:border-gray-600",
                "animate-in slide-in-from-top-2 z-10",
              )}
            >
              <DropdownMenu.Item className="p-0">
                <Link
                  href="/dashboard/blog/createblog"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                >
                  Create Blog
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="p-0">
                <Link
                  href="/dashboard/blog/myblog"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                >
                  My Blogs
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item className="p-0">
                <Link
                  href="/dashboard/blog/editblog"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 w-full text-left"
                >
                  Edit Blog
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          
          <Link
            href="/dashboard/request"
            className={cn(
              "flex items-center p-3 rounded-lg group",
              "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
              "transition-colors duration-200 relative",
            )}
          >
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              {total > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {total}
                </span>
              )}
            </div>
            <span className="ms-3">Requests</span>
          </Link>
{/* 
           <Link
            href="/dashboard/request/codebuddyrequest"
            className={cn(
              "flex items-center p-3 rounded-lg group",
              "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
              "transition-colors duration-200 relative",
            )}
          >
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              {total > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                  {total}
                </span>
              )}
            </div>
            <span className="ms-3">Friend Requests</span>
          </Link> */}

         {hasPortfolio ? (
        <div className="space-y-2">
          <Link
            href="/portfolio/userprofile"
            className={cn(
              "flex items-center p-3 rounded-lg group",
              "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
              "transition-colors duration-200 relative",
            )}
          >
            <Briefcase className="h-5 w-5" />
            <span className="ms-3">My Portfolio</span>
          </Link>
          <ShareButton portfolioId={portfolioId} />
        </div>
      ) : (
        <Link
          href={{
            pathname: "/dashboard/portfolio",
            query: { onSuccess: "handlePortfolioCreated" } 
          }}
          className={cn(
            "flex items-center p-3 rounded-lg group",
            "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
            "transition-colors duration-200 relative",
          )}
        >
          <Briefcase className="h-5 w-5" />
          <span className="ms-3">Create Portfolio</span>
        </Link>
      )}
         
          <div className="space-y-2">
 
  {/* {session.data?.user?.id && (
    <>
      <Bell/>
      <NotificationListener userId={session.data.user.id}/>
    </>
  )} */}
</div>

{/* <button 
  onClick={() => toast.success('Test toast')}
  className="p-2 bg-blue-500 text-white rounded"
>
  Test Toast
</button> */}

          <div className="space-y-2">
            <Link
              href="/dashboard/account"
              className={cn(
                "flex items-center p-3 rounded-lg group",
                "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                "transition-colors duration-200 relative",
              )}
            >
              <CircleUserRound className="h-5 w-5" />
              <span className="ms-3">My Account</span>
            </Link>
          </div>


<div className="space-y-2">
            <Link
              href="/dashboard/chat"
              className={cn(
                "flex items-center p-3 rounded-lg group",
                "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
                "transition-colors duration-200 relative",
              )}
            >
              <MessageSquareText  className="h-5 w-5" />
              <span className="ms-3">Chat</span>
            </Link>
          </div>

          <button
            onClick={() => signOut()}
            className={cn(
              "flex items-center w-full p-3 rounded-lg group mt-4",
              "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700",
              "transition-colors duration-200",
            )}
          >
            <LogOut className="w-5 h-5" />
            <span className="ms-3">Logout</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
