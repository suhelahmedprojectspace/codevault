"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Globe, Lock, Copy, Check, CircleUser, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "@/lib/axios";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface Snippet {
  id: string;
  authorid: string;
  title: string;
  framework: string;
  content: string;
  visibility: string;
  author: {
    username: string;
  };
  allowedUsers: { id: string }[];
}

const LIMIT = 6;

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [data, setData] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState<Snippet[]>([]);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [userid, setUserid] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("");
  const [page, setPage] = useState(1);
  const [totalSnippet, setTotalSnippet] = useState(0);
  const totalPage = Math.ceil(totalSnippet / LIMIT);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Code copied to clipboard!");
  };

  async function fetchData() {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/snippet/available?page=${page}&limit=${LIMIT}`,
      );
      console.log(res.data.snippets);
      setData(res.data.snippets);
      setFilterData(res.data.snippets);
      setTotalSnippet(res.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      setUserid(session?.user?.id || null);
    }
  }, [session, status]);

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleRequest = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (status === "unauthenticated") {
      toast.error("Please login to access this feature.");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }
    try {
      const res = await axios.post("/snippet/request", { snippetId: id });
      if (res.status === 201) {
        toast.success("Access request sent!");
        setRequestedIds((prev) => [...prev, id]);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      console.error("Access request error:", error);
      toast.error("Request failed.");
    }
  };

  const handleSearch = debounce(async (term: string) => {
    if (term.trim() === "") {
      setFilterData(data);
      return;
    }

    const localResult = data.filter((snippet) =>
      snippet.title.toLowerCase().includes(term.toLowerCase()),
    );
    setFilterData(localResult);

    if (term.length > 2) {
      try {
        const res = await axios.get(`/snippet/search?query=${term}`);
        setFilterData(res.data.result);
      } catch (error) {
        console.error("Server search failed:", error);
      }
    }
  }, 300);

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearch(term);
    handleSearch(term);
  };

  const handleSelect = (value: string) => {
    setSelect(value);
    if (value === "All") {
      setFilterData(data);
    } else {
      const result = data.filter((d) => d.visibility === value);
      setFilterData(result);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 flex-col gap-6">
      <div className="w-full max-w-7xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search snippets..."
              className="w-full pl-10 pr-4 py-5 rounded-lg bg-background shadow-sm focus-visible:ring-2"
              value={search}
              onChange={onChangeSearch}
            />
          </div>

          <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Snippets</SelectItem>
              <SelectItem value="public">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" /> Public
                </div>
              </SelectItem>
              <SelectItem value="private">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-500" /> Private
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: LIMIT }).map((_, index) => (
                <Card key={index} className="h-[400px]">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[200px] w-full" />
                  </CardContent>
                </Card>
              ))
            : filterData.map((data) => (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group relative h-full hover:shadow-lg transition-shadow duration-200 border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold line-clamp-2">
                          {data.title}
                        </CardTitle>

                        {data.visibility === "private" &&
                        data.authorid !== userid &&
                        !data.allowedUsers?.some(
                          (user) => user.id === userid,
                        ) ? null : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full w-8 h-8 p-2"
                            onClick={() => handleCopy(data.content, data.id)}
                          >
                            {copiedId === data.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-muted-foreground hover:text-primary" />
                            )}
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <CircleUser className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-primary">
                            {data.author?.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{data.framework}</Badge>
                          {data.visibility === "public" ? (
                            <Globe className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="relative">
                      {data.visibility === "private" &&
                        data.authorid !== userid &&
                        !data.allowedUsers?.some(
                          (user) => user.id === userid,
                        ) && (
                          <div className="absolute inset-0 backdrop-blur-sm bg-white/90 dark:bg-black/80 flex items-center justify-center rounded-lg">
                            <div className="text-center space-y-4">
                              <Lock className="w-8 h-8 mx-auto text-red-500" />
                              <Button
                                variant="destructive"
                                onClick={(e) => handleRequest(e, data.id)}
                                disabled={requestedIds.includes(data.id)}
                                className="shadow-md"
                              >
                                {requestedIds.includes(data.id)
                                  ? "Request Sent ✓"
                                  : "Request Access"}
                              </Button>
                              <p className="text-sm text-muted-foreground px-4">
                                Private snippet - request access to view
                              </p>
                            </div>
                          </div>
                        )}

                      <SyntaxHighlighter
                        language="javascript"
                        style={vscDarkPlus}
                        customStyle={{
                          borderRadius: "0.375rem",
                          padding: "1rem",
                          margin: 0,
                        }}
                        codeTagProps={{
                          style: {
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.875rem",
                            lineHeight: "1.5",
                          },
                        }}
                      >
                        {data.content}
                      </SyntaxHighlighter>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        <div className="flex items-center justify-center gap-4 py-8">
          <Button
            variant="outline"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPage}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
