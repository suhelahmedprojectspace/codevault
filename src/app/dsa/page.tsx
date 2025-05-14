"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DSAData from "@/data/450DSA";
import TopicCard from "@/components/TopicCard";
import ProgressBar from "@/components/ProgressBar";

interface Question {
  Topic: string;
  Problem: string;
  Done: boolean;
  Bookmark: boolean;
  Notes: string;
  URL: string;
  URL2: string;
}

interface Topic {
  topicName: string;
  position: number;
  started: boolean;
  doneQuestions: number;
  questions: Question[];
}

const DSA450Dashboard = () => {
  const router = useRouter();
  const [data, setData] = useState<Topic[]>(DSAData);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    const totalQuestions = data.reduce(
      (acc, topic) => acc + topic.questions.length,
      0,
    );
    const totalDone = data.reduce((acc, topic) => acc + topic.doneQuestions, 0);
    setTotalProgress(Math.round((totalDone / totalQuestions) * 100));
  }, [data]);

  const handleTopicClick = (topicName: string) => {
    const category = topicName.toLowerCase().replace(/\s+/g, "-");
    router.push(`/dsa/${category}`);
  };

  const filteredTopics = data.filter((topic) =>
    topic.topicName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              450 DSA Questions Tracker
            </h1>
            <p className="text-gray-600">
              Master DSA by solving these curated problems
            </p>

            <div className="max-w-6xl mx-auto pt-2">
              <button
                onClick={() => router.push("/interview")}
                className="flex items-center text-blue-600 mb-4"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to all topics
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search topics..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">
              Overall Progress
            </h2>
            <span className="text-blue-600 font-medium">{totalProgress}%</span>
          </div>
          <ProgressBar progress={totalProgress} />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>
              {data.reduce((acc, topic) => acc + topic.doneQuestions, 0)}{" "}
              problems solved
            </span>
            <span>
              {data.reduce((acc, topic) => acc + topic.questions.length, 0)}{" "}
              total problems
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic.position}
            topic={topic}
            onClick={() => handleTopicClick(topic.topicName)}
          />
        ))}
      </div>
    </div>
  );
};

export default DSA450Dashboard;
