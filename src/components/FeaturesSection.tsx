"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ShieldCheck,
  BookOpen,
  Briefcase,
  Users,
  LayoutDashboard,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";
const features = [
  {
    title: "Military-Grade Security",
    icon: <ShieldCheck className="w-7 h-7 text-blue-600" />,
    description: (
      <>
        <span className="text-blue-600 font-medium">Private Vault:</span>{" "}
        AES-256 encryption
        <br />
        <span className="text-blue-600 font-medium">Public Showcase:</span>{" "}
        Share selectively with 500k+ devs
        <div className="mt-3 text-sm text-blue-600">✦ 3x faster code reuse</div>
      </>
    ),
    bg: "bg-blue-50",
  },
  {
    title: "Smart Knowledge Hub",
    icon: <BookOpen className="w-7 h-7 text-purple-600" />,
    description: (
      <>
        <span className="text-purple-600 font-medium">Private Drafts:</span>{" "}
        Perfect your articles
        <br />
        <span className="text-purple-600 font-medium">Public Blogs:</span> Build
        authority in your stack
        <div className="mt-3 text-sm text-purple-600">
          ✦ 68% reader engagement boost
        </div>
      </>
    ),
    bg: "bg-purple-50",
  },
  {
    title: "Career Accelerator",
    icon: <Briefcase className="w-7 h-7 text-green-600" />,
    description: (
      <>
        FAANG-quality challenges + solutions
        <br />
        Mock interviews & personalized feedback
        <div className="mt-3 text-sm text-green-600">
          ✦ 40% faster job placement
        </div>
      </>
    ),
    bg: "bg-green-50",
  },
  {
    title: "Code Buddy System",
    icon: <Users className="w-7 h-7 text-yellow-600" />,
    description: (
      <>
        Pair programming matching
        <br />
        Code review exchanges & mentorship
        <div className="mt-3 text-sm text-yellow-600">
          ✦ 2.5x faster debugging
        </div>
      </>
    ),
    bg: "bg-yellow-50",
  },
  {
    title: "Auto-Generated Portfolio",
    icon: <LayoutDashboard className="w-7 h-7 text-red-600" />,
    description: (
      <>
        Showcase your best public work
        <br />
        Employer analytics & customizable layouts
        <div className="mt-3 text-sm text-red-600">
          ✦ 3x more interview requests
        </div>
      </>
    ),
    bg: "bg-red-50",
  },
  {
    title: "Code Marketplace (Coming Soon)",
    icon: <Store className="w-7 h-7 text-indigo-600 animate-pulse" />,
    description: (
      <>
        Sell premium code snippets (soon)
        <br />
        Recurring license models & dev analytics
        <div className="mt-3 text-sm text-indigo-600">
          ✦ $2.8M paid to devs (Beta Waitlist)
        </div>
      </>
    ),
    bg: "bg-indigo-50",
  },
];

const FeaturesSection = () => {
  const router = useRouter();
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold text-2xl shadow-sm">
              <span className="relative">
                CV
                <span className="absolute -right-1 -top-1 w-2 h-2 bg-blue-300 rounded-full"></span>
              </span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Transform Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Development Workflow
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            92% of developers report increased productivity within 30 days of
            using CodeVault
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="hover:shadow-xl transition-all duration-300 border-gray-100 group"
            >
              <CardHeader>
                <div
                  className={`w-14 h-14 ${feature.bg} rounded-lg flex items-center justify-center mx-auto`}
                >
                  {feature.icon}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardTitle className="text-gray-900 mb-3">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3.5 px-8 rounded-xl shadow-sm transition-all duration-200 inline-flex items-center group"
            onClick={() => router.push("/login")}
          >
            <span className="mr-2 group-hover:mr-3 transition-all">
              Start Your Success Journey
            </span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
