import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
const snippets = [
  {
    title: "Simple Counter with React",
    content: `'use client';
  import React, { useState } from 'react';
  
  export default function Counter() {
    const [count, setCount] = useState(0);
  
    return (
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-bold">Count: {count}</h2>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
      </div>
    );
  }`,
    description:
      "A basic counter component using React's useState hook. Useful for testing state changes in UI elements.",
  },
  {
    title: "Fetch API with Axios",
    content: `import axios from 'axios';
  import { useEffect, useState } from 'react';
  
  export default function FetchUsers() {
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      axios.get('/api/users')
        .then(response => setUsers(response.data))
        .catch(error => console.error('Error fetching users:', error));
    }, []);
  
    return (
      <ul>
        {users.map(user => <li key={user.id}>{user.name}</li>)}
      </ul>
    );
  }`,
    description:
      "This React component fetches user data from an API using Axios and displays a simple user list.",
  },
  {
    title: "Debounce Hook in React",
    content: `import { useState, useEffect } from 'react';
  
  function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebounced(value);
      }, delay);
  
      return () => clearTimeout(handler);
    }, [value, delay]);
  
    return debounced;
  }
  
  export default useDebounce;`,
    description:
      "A custom hook for debouncing any rapidly changing value, like user input or search terms.",
  },
];

const ViewSnippets = () => {
  return (
    <div className="max-w-full h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {snippets.map((data) => (
          <div className="bg-white dark:bg-zinc-900 border shadow-sm transition">
            <div className="text-sm font-semibold p-4">{data.title}</div>
            <hr />
            <div>
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
                customStyle={{
                  width: "100%",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  boxSizing: "border-box",
                }}
              >
                {data.content}
              </SyntaxHighlighter>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewSnippets;
