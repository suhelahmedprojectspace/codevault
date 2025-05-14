"use client";
import { useState } from "react";
import { AppSideBar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import Logo from "@/components/Logo";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebar, setSidebarOpen] = useState(false);
  return (
    <div className="w-full flex  min-h-screen">
      <div
        className={`md:block ${sidebar ? "block" : "hidden"} fixed z-30 md:relative md:h-auto  bg-white  border-r  border-gray-200 dark:bg-gray-800 dark:border-gray-700  w-64 `}
      >
        <AppSideBar closeSidebar={() => setSidebarOpen(false)} />
      </div>
      {sidebar && (
        <div
          className="fixed inset-0 bg-zinc-600 opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="w-full min-h-screen overflow-hidden flex-1 flex flex-col">
        <div className="md:hidden  sticky top-0 p-4 bg-white border-b-1 z-20 border-gray-400 shadow flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <Logo />
        </div>
        <main className="flex-1 p-4 pt-10 overflow-y-auto  bg-white dark:bg-gray-900">
          <div className="flex h-full w-full items-center justify-center">
            <div className="w-full max-w-4xl ">
              <TooltipProvider>{children}</TooltipProvider>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
