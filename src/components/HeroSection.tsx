'use client';
import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute left-1/4 top-1/3 w-32 h-32 rounded-full bg-primary/10" />
        <div className="absolute right-1/4 bottom-1/3 w-32 h-32 rounded-full bg-secondary/10" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-white font-bold text-2xl shadow-lg mb-4">
            <span className="relative">
              CV
              <span className="absolute -right-1 -top-1 w-2 h-2 bg-secondary rounded-full border border-white"></span>
            </span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CodeVault
          </h1>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-6">
          Your <span className="text-primary">Secure Hub</span> for
          <br />
          Code & Technical Knowledge
        </h2>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Store private snippets, share public code, and organize technical resources - all with
          enterprise-grade security and intuitive search.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="shadow-md hover:shadow-lg transition-all"
            onClick={() => router.push('/signup')}
          >
            Start For Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 hover:bg-accent/10"
            onClick={() => router.push('/signup')}
          >
            See How It Works
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <LockIcon className="w-4 h-4 text-primary" />
            <span>End-to-End Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <CodeIcon className="w-4 h-4 text-primary" />
            <span>30+ Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudIcon className="w-4 h-4 text-primary" />
            <span>Cloud Sync</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// Reusable icons
const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const CodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

const CloudIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
    />
  </svg>
);

export default HeroSection;
