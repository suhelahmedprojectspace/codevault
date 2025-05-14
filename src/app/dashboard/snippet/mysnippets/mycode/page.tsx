"use client";

import React, { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  atomDark,
  materialOceanic,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
  Globe,
  Lock,
  Edit2Icon,
  Trash2,
  Copy,
  Search,
  Filter,
  Share2,
  Plus,
} from "lucide-react";
import axios from "@/lib/axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DeleteCard from "@/components/DeleteCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface Snippet {
  id: string;
  title: string;
  framework: string;
  content: string;
  visibility: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const MySnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string>("all");
  const [selectedVisibility, setSelectedVisibility] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSnippets();
  }, []);

  useEffect(() => {
    filterSnippets();
  }, [
    snippets,
    searchQuery,
    selectedFramework,
    selectedVisibility,
    selectedLanguage,
  ]);

  const fetchSnippets = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await axios.get("/snippet");
      setSnippets(res.data.user.snippetCollection);
      console.log(res.data.user);
    } catch (error) {
      console.error("Error fetching snippets", error);
      toast.error("Failed to load snippets");
    } finally {
      setLoading(false);
    }
  };

  const filterSnippets = () => {
    let result = [...snippets];

    if (searchQuery) {
      result = result.filter(
        (snippet) =>
          snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          snippet.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          snippet.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    if (selectedFramework !== "all") {
      result = result.filter(
        (snippet) => snippet.framework === selectedFramework,
      );
    }

    if (selectedVisibility !== "all") {
      result = result.filter(
        (snippet) => snippet.visibility === selectedVisibility,
      );
    }

    if (selectedLanguage !== "all") {
      result = result.filter(
        (snippet) => snippet.language === selectedLanguage,
      );
    }

    setFilteredSnippets(result);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/snippet/${deleteId}`);
      setSnippets((prev) => prev.filter((item) => item.id !== deleteId));
      toast.success("Snippet deleted successfully");
    } catch (error) {
      console.error("Error deleting snippet:", error);
      toast.error("Failed to delete snippet");
    } finally {
      setDialogOpen(false);
      setDeleteId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
    setDialogOpen(true);
  };

  const copyToClipboard = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareSnippet = async (id: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out this code snippet",
          text: "I found this interesting code snippet you might like",
          url: `${window.location.origin}/snippet/${id}`,
        });
      } else {
        navigator.clipboard.writeText(
          `${window.location.origin}/snippet/${id}`,
        );
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const getUniqueValues = (key: keyof Snippet): string[] => {
    const values = snippets.map((snippet) => snippet[key]);
    return Array.from(
      new Set(
        values
          .flatMap((value) => (Array.isArray(value) ? value : [value]))
          .filter((v) => typeof v === "string"),
      ),
    );
  };

  if (loading) {
    return (
      <div className="w-full py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 px-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">My Code Snippets</h1>
        {/* <Link href="/dashboard/snippet/createcode">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Snippet
          </Button>
        </Link> */}
      </div>

      <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search snippets..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={selectedFramework}
            onValueChange={setSelectedFramework}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Framework" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frameworks</SelectItem>
              {getUniqueValues("framework").map((framework) => (
                <SelectItem key={framework} value={framework}>
                  {framework}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Language" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {getUniqueValues("language").map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedVisibility}
            onValueChange={setSelectedVisibility}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Visibility" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredSnippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h2 className="text-xl font-semibold">No snippets found</h2>
          <p className="text-muted-foreground max-w-md">
            {snippets.length === 0
              ? "You haven't created any code snippets yet. Start saving your favorite pieces of code and access them anytime."
              : "No snippets match your current filters. Try adjusting your search criteria."}
          </p>
          <Link href="/dashboard/snippet/createcode">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Snippet
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6 w-full max-w-6xl mx-auto">
          {filteredSnippets.map((snippet) => (
            <div
              key={snippet.id}
              className="bg-white dark:bg-zinc-900 border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-start p-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {snippet.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </span>
                    {snippet.updatedAt !== snippet.createdAt && (
                      <span className="text-xs">(edited)</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {snippet.framework}
                  </Badge>
                  {snippet.visibility === "public" ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <Globe className="w-4 h-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>Public</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger>
                        <Lock className="w-4 h-4 text-red-500" />
                      </TooltipTrigger>
                      <TooltipContent>Private</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>

              {snippet.tags?.length > 0 && (
                <div className="px-4 pb-2 flex flex-wrap gap-1">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="relative flex-1 overflow-auto max-h-60">
                <SyntaxHighlighter
                  language={snippet.language || "javascript"}
                  style={materialOceanic}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    height: "100%",
                    fontSize: "0.8rem",
                  }}
                  showLineNumbers
                >
                  {snippet.content}
                </SyntaxHighlighter>
              </div>

              <div className="flex justify-between items-center p-4 border-t">
                <div className="text-xs text-muted-foreground">
                  {snippet.language}
                </div>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          copyToClipboard(snippet.content, snippet.id)
                        }
                      >
                        <Copy
                          className={`h-4 w-4 ${copiedId === snippet.id ? "text-green-500" : ""}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => shareSnippet(snippet.id)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share</TooltipContent>
                  </Tooltip>

                  <Link
                    href={{
                      pathname: "/dashboard/editsnippet",
                      query: { id: snippet.id },
                    }}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2Icon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>
                  </Link>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => openDeleteDialog(snippet.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteCard
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default MySnippets;
