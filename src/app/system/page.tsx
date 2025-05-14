"use client";
import { system_design_questions } from "@/data/design";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, ChevronRight, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SystemDesignQuestions() {
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate all unique topics for filtering
  const allTopics = Array.from(
    new Set(system_design_questions.flatMap((q) => q.key_topics)),
  ).sort();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const filteredQuestions = system_design_questions.filter((question) => {
    const matchesSearch =
      question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.key_topics.some((topic) =>
        topic.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesTopics =
      selectedTopics.length === 0 ||
      selectedTopics.every((topic) => question.key_topics.includes(topic));

    return matchesSearch && matchesTopics;
  });

  const addTopic = (topic: string) => {
    if (!selectedTopics.includes(topic)) {
      setSelectedTopics((prev) => [...prev, topic]);
    }
  };

  const removeTopic = (topic: string) => {
    setSelectedTopics((prev) => prev.filter((t) => t !== topic));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            System Design Interview Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Practice with {system_design_questions.length} real-world system
            design challenges
          </p>
        </div>

        {/* Search and Filter - Now in one line */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 w-full">
              {/* Search Input - takes remaining space */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions or topics..."
                  className="pl-10 py-6 text-lg w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Select Dropdown */}
              <div className="w-[240px]">
                <Select onValueChange={addTopic}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTopics.map((topic) => (
                      <SelectItem
                        key={topic}
                        value={topic}
                        disabled={selectedTopics.includes(topic)}
                      >
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Clear All Button - only shows when topics are selected */}
              {selectedTopics.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTopics([])}
                  className="whitespace-nowrap"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Selected topics chips - appears below the search row */}
            <div className="flex flex-wrap gap-2 min-h-8">
              {selectedTopics.map((topic) => (
                <Badge
                  key={topic}
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => removeTopic(topic)}
                >
                  {topic}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-muted-foreground">
            Showing {filteredQuestions.length} questions
          </p>
        </div>

        {/* Questions Grid */}
        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((question) => (
              <Card
                key={question.id}
                className="hover:shadow-md transition-all duration-200 border-border/50 hover:border-primary/30 group"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">
                      #{question.id}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">
                    {question.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.key_topics.map((topic) => (
                      <Badge variant="outline" key={topic} className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <div className="px-6 pb-4">
                  <Link
                    href={question.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-primary hover:underline group-hover:text-primary/80 transition-colors"
                  >
                    View solution <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-lg">
            <h3 className="text-xl font-medium text-muted-foreground mb-4">
              No questions match your search
            </h3>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedTopics([]);
              }}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
