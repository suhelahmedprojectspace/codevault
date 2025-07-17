"use client";

import { useEffect, useState } from "react";
import { AppSideBar } from "@/components/AppSidebar";
import { Menu, Bell } from "lucide-react";
import { Notification } from "@prisma/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import Logo from "@/components/Logo";
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebar, setSidebarOpen] = useState(false);
  // const [notifications, setNotifications] = useState<Notification[]>([]);

  

  // const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="w-full flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`md:block ${
          sidebar ? "block" : "hidden"
        } fixed z-30 md:relative md:h-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 w-64`}
      >
        <AppSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebar && (
        <div
          className="fixed inset-0 bg-zinc-600 opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="w-full min-h-screen overflow-hidden flex-1 flex flex-col">
        {/* Top Nav */}
        <div className="md:hidden sticky top-0 p-4 bg-white border-b-1 z-20 border-gray-400 shadow flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <Logo />
          {/* <div className="relative">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                {unreadCount}
              </span>
            )}
          </div> */}
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 pt-10 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-full max-w-4xl">
              <TooltipProvider>{children}</TooltipProvider>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
