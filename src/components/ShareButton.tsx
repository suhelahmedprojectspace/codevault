"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { CheckIcon, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

const ShareButton = ({ portfolioId }: { portfolioId: string }) => {
  const [copied, setCopied] = useState(false);
  const portfolioUrl = `${window.location.origin}/portfolio/${portfolioId}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      toast.success("Portfolio link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);

      if (navigator.share) {
        await navigator.share({
          title: `Check out my portfolio`,
          text: `View my professional portfolio`,
          url: portfolioUrl,
        });
      }
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleShare}
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg group",
              "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700",
              "transition-colors duration-200 relative",
            )}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-green-500" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            <span>Share Portfolio</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Share this link to showcase your portfolio</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ShareButton;
