"use client";
import { reactQuestion } from "@/data/react";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface Question {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const InterviewPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = ["All", ...new Set(reactQuestion.map((q) => q.category))];

  const filteredQuestions = reactQuestion.filter((q) => {
    const matchesSearch =
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAnswer = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderAnswer = (answer: string) => {
    const parts = answer.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.replace(/```[a-z]*\n/, "").replace(/```$/, "");
        return (
          <SyntaxHighlighter
            key={index}
            language="javascript"
            style={atomDark}
            className="rounded-md text-sm my-4"
            showLineNumbers={false}
          >
            {code.trim()}
          </SyntaxHighlighter>
        );
      } else {
        const lines = part.split("\n");
        return lines.map((line, lineIndex) => {
          if (line.startsWith("**") && line.endsWith("**")) {
            return <strong key={lineIndex}>{line.slice(2, -2)}</strong>;
          } else if (line.includes("|") && line.includes("-")) {
            const rows = part.split("\n").filter((l) => l.includes("|"));
            return (
              <table
                key={lineIndex}
                className="min-w-full my-4 border-collapse"
              >
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.split("|").map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`border px-4 py-2 ${rowIndex === 0 ? "font-bold bg-gray-100" : ""}`}
                        >
                          {cell.trim()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          } else {
            return (
              <p key={lineIndex} className="mb-2">
                {line}
              </p>
            );
          }
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            React Interview Questions
          </h1>
          <p className="text-lg text-gray-600">
            {reactQuestion.length} curated questions to prepare for your next
            interview
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search questions or answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <label htmlFor="category" className="sr-only">
                Category
              </label>
              <select
                id="category"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredQuestions.length} of {reactQuestion.length}{" "}
            questions
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div
                  className="px-4 py-5 sm:p-6 cursor-pointer flex justify-between items-start"
                  onClick={() => toggleAnswer(q.id)}
                >
                  <div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                      {q.category}
                    </span>
                    <h3 className="text-lg font-medium text-gray-900">
                      {q.question}
                    </h3>
                  </div>
                  <button
                    className="ml-4 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAnswer(q.id);
                    }}
                  >
                    {expandedId === q.id ? (
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {expandedId === q.id && (
                  <div className="px-4 py-5 sm:p-6 border-t border-gray-200">
                    <div className="prose max-w-none">
                      {renderAnswer(q.answer)}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No questions found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
