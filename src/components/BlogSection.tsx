'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from '@/lib/axios';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming you're using shadcn/ui

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime?: string;
  slug: string;
  author: string;
  content: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/blog/hero');
        setBlogs(res.data.blog);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-medium text-sm uppercase tracking-wider">
            Insights & Tutorials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">Developer Blog</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our latest technical articles and industry insights
          </p>
        </div>

        {blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group border border-gray-100 rounded-lg p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">{blog.date}</span>
                    {blog.readTime && (
                      <>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{blog.readTime}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt || blog.content.substring(0, 150) + '...'}
                  </p>
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="inline-flex items-center text-blue-600 font-medium text-sm hover:underline"
                  >
                    Read article
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/blogs"
                className="inline-flex items-center px-5 py-2.5 border border-blue-600 text-base font-medium rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
              >
                View all articles
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available at this time</p>
          </div>
        )}
      </div>
    </section>
  );
}
