"use client";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const hiddenRoutes = ["/userprofile", "/dashboard", "/portfolio/"];

export default function MainWrapper({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isPortfolioIdPage = /^\portfolio\/[^\/]+$/.test(pathname);
  const hideLayout =
    hiddenRoutes.some((route) => pathname.startsWith(route)) ||
    isPortfolioIdPage;

  return (
    <div className="flex flex-col min-h-screen">
      {!hideLayout && <Navbar className="h-16 fixed top-0 w-full z-50" />}
      <div className={`flex-1 ${!hideLayout ? "mt-16" : ""}`}>{children}</div>

      {!hideLayout && <Footer />}
    </div>
  );
}
