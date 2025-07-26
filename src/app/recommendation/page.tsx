'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, X, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SOCIAL_MEDIA_PLATFORMS } from '@/constants/socailLinks';
import axios from '@/lib/axios';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface UserDetails {
  id: string;
  userid: string;
  name: string;
  title: string;
  profile: string;
  links: { platform: string; url: string }[];
  matchDetails?: string[];
  percentage?: number;
}

const RecommendationPage = () => {
  const session = useSession();
  const router = useRouter();
  const [accountIDs, setAccountIDs] = useState<string[]>([]);
  const [details, setDetails] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [sentRequest, setSentRequests] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchRecommendedUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/codebuddy');
        const matches = res.data.matches;
        const ids = matches
          .map((match: any) => match.userId)
          .filter((id: string | null) => id !== null);
        setAccountIDs(ids);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendedUser();
  }, []);

  useEffect(() => {
    if (accountIDs.length === 0) return;

    const fetchAccountDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`/account/all`, { accountIDs });
        setDetails(res.data.portfolios);
      } catch (error) {
        console.error('Error fetching account details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccountDetails();
  }, [accountIDs]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const handleViewPortfolio = (userId: string) => {
    router.push(`/portfolio/${userId}`);
  };

  const handleRequest = async (userId: string) => {
    try {
      const res = await axios.post('/codebuddy/request', {
        receiverId: userId,
      });
      if (res.status === 201) {
        toast.success('Connection request sent!');
        setSentRequests((prev) => ({ ...prev, [userId]: true }));
      }
    } catch (error) {
      toast.error('Failed to send request');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center">
            {[...Array(10)].map((_, i) => (
              <div className="flex flex-col items-center justify-center space-y-3" key={i}>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
                <Skeleton className="h-[300px] w-[250px] rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Your Ideal Dev Partners
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            We've curated a list of developers that best align with your skills, preferences, and
            goals.
          </motion.p>
        </div>

        {details.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No matches found. Check back later or update your preferences.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-center"
          >
            {details.map((dev, index) => (
              <motion.div key={index} variants={cardVariants} className="flex justify-center">
                <Card className="w-full max-w-sm flex flex-col items-center justify-center text-center p-6 border border-gray-200 dark:border-gray-700 transition-all shadow-md">
                  {sentRequest[dev.userid] ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="text-4xl">🎉</div>
                      <h3 className="text-xl font-semibold text-blue-600 dark:text-white-300 mt-2">
                        Request Sent!
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        You've just taken the first step toward an awesome collaboration.
                      </p>
                      <Link
                        href="/dashboard"
                        className="mt-4 text-sm text-blue-600 dark:text-blue-400 underline"
                      >
                        Go To Your Dashboard
                      </Link>
                    </motion.div>
                  ) : (
                    <>
                      <CardHeader className="relative p-0 w-full">
                        <div className="absolute right-3 top-3 flex space-x-2">
                          <button
                            onClick={() => handleViewPortfolio(dev.id)}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="View portfolio"
                          >
                            <ExternalLink className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          </button>
                          <button
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Dismiss recommendation"
                          >
                            <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                          </button>
                        </div>
                      </CardHeader>

                      <CardContent className="flex flex-col items-center pt-8 pb-4 px-6 space-y-3">
                        <div className="mb-4 relative">
                          <Avatar className="w-24 h-24 border-4 border-white dark:border-gray-800 shadow-md">
                            <AvatarImage src={dev.profile} alt={dev.name} />
                            <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                              {dev.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {dev.percentage && (
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {dev.percentage}%
                            </div>
                          )}
                        </div>

                        <Badge variant="secondary" className="text-sm font-medium">
                          {dev.title || 'Developer'}
                        </Badge>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                          {dev.name}
                        </h2>

                        {/* {dev.matchDetails?.length > 0 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                            {dev.matchDetails[0]}
                          </div>
                        )} */}

                        <div className="flex justify-center space-x-2 mt-2">
                          {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
                            const match = dev.links?.find((link) =>
                              link.url?.includes(platform.baseUrl),
                            );
                            if (!match) return null;
                            const Icon = platform.icon;
                            return (
                              <Link
                                key={platform.label}
                                href={match.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                <Icon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                              </Link>
                            );
                          })}
                        </div>
                      </CardContent>

                      <CardFooter className="mt-auto pb-6 px-6 w-full">
                        <div className="flex space-x-3 w-full">
                          <Button
                            className="flex-1"
                            variant="default"
                            type="button"
                            onClick={() => handleRequest(dev.userid)}
                          >
                            Connect
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleViewPortfolio(dev.id)}
                          >
                            Portfolio
                          </Button>
                        </div>
                      </CardFooter>
                    </>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecommendationPage;
