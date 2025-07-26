'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DSAData from '@/data/450DSA';

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

const TopicPage = () => {
  const router = useRouter();
  const { category } = useParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const foundTopic = DSAData.find(
      (t) => t.topicName.toLowerCase().replace(/\s+/g, '-') === category,
    );

    if (foundTopic) {
      setTopic(foundTopic);
    } else {
      router.push('/dsa');
    }
  }, [category, router]);

  const handleQuestionToggle = (questionIndex: number) => {
    if (!topic) return;

    const updatedQuestions = [...topic.questions];
    updatedQuestions[questionIndex].Done = !updatedQuestions[questionIndex].Done;

    const doneCount = updatedQuestions.filter((q) => q.Done).length;

    setTopic({
      ...topic,
      questions: updatedQuestions,
      doneQuestions: doneCount,
    });
  };

  const filteredQuestions =
    topic?.questions.filter((q) => q.Problem.toLowerCase().includes(searchTerm.toLowerCase())) ||
    [];

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loading topic...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/dsa')}
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

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{topic.topicName}</h1>
              <p className="text-gray-600">
                {topic.questions.length} problems • {topic.doneQuestions} solved (
                {Math.round((topic.doneQuestions / topic.questions.length) * 100)}
                %)
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
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

          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${(topic.doneQuestions / topic.questions.length) * 100}%`,
              }}
            ></div>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((question, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg flex items-center justify-between ${
                  question.Done ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={question.Done}
                    onChange={() => handleQuestionToggle(index)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                  />
                  <a
                    href={question.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`font-medium ${
                      question.Done ? 'text-green-700' : 'text-gray-700'
                    } hover:text-blue-600`}
                  >
                    {question.Problem}
                  </a>
                </div>
                {question.URL2 && (
                  <a
                    href={question.URL2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 ml-2"
                  >
                    Alt
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
