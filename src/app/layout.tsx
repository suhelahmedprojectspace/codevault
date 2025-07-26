import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './Providers';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import MainWrapper from './MainWrapper';
import { Suspense } from 'react';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CodeVault | Save, Share & Organize Your Code Snippets',
  description:
    'CodeVault is a developer-friendly platform to save, organize, and share code snippets with syntax highlighting and framework-specific support.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full  custom-scrollbar:">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
      <Suspense fallback={<div>Loading page...</div>}>
        <Providers>
          <MainWrapper>
            <Toaster position="top-right" />
            {children}
          </MainWrapper>
        </Providers>
        </Suspense>
      </body>
    </html>
  );
}
