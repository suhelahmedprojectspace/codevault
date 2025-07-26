'use client';
import React from 'react';
import Link from 'next/link';

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

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick }) => {
  const progressPercentage = Math.round((topic.doneQuestions / topic.questions.length) * 100);

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-gray-800">{topic.topicName}</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {topic.questions.length} problems
          </span>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span className="font-medium">
              {topic.doneQuestions}/{topic.questions.length} ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
