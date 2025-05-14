"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TechBadgeInput = ({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (val: string[]) => void;
}) => {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && input.trim()) {
      e.preventDefault();
      const newTag = input.trim().replace("#", "");
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInput("");
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleRemove = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const newTags = pasteData
      .split(/[,\s]+/)
      .filter(
        (tag) => tag.trim() && !tags.includes(tag.replace("#", "").trim()),
      )
      .map((tag) => tag.replace("#", "").trim());

    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Technologies Used
        <span className="text-muted-foreground text-xs ml-2">
          (Add with space/enter or paste multiple)
        </span>
      </label>

      <div
        className={`flex flex-wrap items-center gap-2 p-3 rounded-md border transition-colors ${
          isFocused
            ? "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400 dark:ring-blue-400/20"
            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
        } bg-background`}
      >
        <AnimatePresence>
          {tags.map((tag) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Badge
                variant="secondary"
                className="py-1.5 px-3 flex items-center gap-1.5 group"
              >
                <span className="text-sm font-medium">{tag}</span>
                <button
                  onClick={() => handleRemove(tag)}
                  className="opacity-70 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="relative flex-1 min-w-[120px]">
          <Input
            type="text"
            placeholder="React (press space/enter)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="border-0 p-0 h-auto focus-visible:ring-0 shadow-none"
          />
          {!input && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{tags.length} technologies added</span>
          <button
            onClick={() => setTags([])}
            className="text-red-500 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default TechBadgeInput;
