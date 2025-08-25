'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/axios';
import Link from 'next/link';
import { BookOpen, Clock, Heart, Share2, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { CommentSection } from '@/components/CommentSection';
import { Blog, Comment } from '@/types/blog';

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  return (
    <div className="overflow-hidden rounded-lg my-4">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          borderRadius: '0.5rem',
          padding: '1rem',
          margin: '0',
          backgroundColor: '#1e1e1e',
          overflow: 'auto',
          maxWidth: '100%',
        }}
        PreTag="div"
        wrapLines={true}
        wrapLongLines={true}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
};

const parseContent = (content: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');

  doc.querySelectorAll('pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (code) {
      const languageMatch = code.className.match(/language-(\w+)/);
      const language = languageMatch ? languageMatch[1] : 'text';
      const codeContent = code.textContent || '';
      const marker = document.createElement('div');
      marker.setAttribute('data-code', encodeURIComponent(codeContent));
      marker.setAttribute('data-language', language);
      pre.replaceWith(marker);
    }
  });

  return doc.body.innerHTML;
};

const getReadingTime = (text: string) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const Page = () => {
  const session = useSession();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [processedContent, setProcessedContent] = useState<string>('');
  const isBlogAuthor = session.data?.user.id === blog?.author.id;
  const params = useParams();

  const id = params.id;

  useEffect(() => {
    const fetchComments = async () => {
      if (!blog?.id) return;
      try {
        const res = await axios.get(`/comment/${blog.id}`);
        console.log('Bhai ek comment hai', res.data);
        setComment(res.data.existBlog.comments);
      } catch (error) {
        console.error('Failed to fetch data');
      }
    };
    fetchComments();
  }, [blog?.id]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/blog/${id}`);
        setBlog(res.data.getBlog);
        setLikes(res.data.getBlog.likes || 0);
      } catch (err) {
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (blog?.content) {
      const parsedContent = parseContent(blog.content);
      setProcessedContent(parsedContent);
    }
  }, [blog]);

  const handleLike = async () => {
    try {
      if (hasLiked) {
        const res = await axios.delete(`/like/${id}`);
        console.log(res);
        setLikes((prev) => prev - 1);
      } else {
        const res = await axios.post(`/like/${id}`);
        console.log(res);
        setLikes((prev) => prev + 1);
      }
      setHasLiked(!hasLiked);
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  useEffect(() => {
    const getLikes = async () => {
      const res = await axios.get(`/like/${id}`);
      setLikes(res.data.count);
    };
    getLikes();
    const interval = setInterval(getLikes, 30_000);
    return () => clearInterval(interval);
  }, [id]);

  const readingTime = blog ? getReadingTime(blog.content) : 0;
  const publishDate = blog ? format(new Date(blog.createdAt), 'MMMM d, yyyy') : '';
  const hasAuthorBlogs = blog?.author?.blog?.length ?? 0 > 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold">Blog not found</h2>
        <p className="text-muted-foreground mt-2">
          The blog you're looking for doesn't exist or may have been removed.
        </p>
        <Link href="/" className="mt-4 inline-block text-primary">
          Back to home
        </Link>
      </div>
    );
  }

  const renderContent = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(processedContent, 'text/html');
    const nodes = Array.from(doc.body.childNodes);

    return nodes.map((node, index) => {
      const el = node as HTMLElement;
      if (el.nodeType === 1 && el.hasAttribute('data-code')) {
        const code = decodeURIComponent(el.getAttribute('data-code') || '');
        const language = el.getAttribute('data-language') || 'text';
        return <CodeBlock key={index} language={language} value={code} />;
      }
      return (
        <div
          key={index}
          className="overflow-hidden break-words"
          dangerouslySetInnerHTML={{
            __html: el.outerHTML || node.textContent || '',
          }}
        />
      );
    });
  };

  const handlePostComment = async (id: string) => {
    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const res = await axios.post('/comment', {
        content,
        blogId: id,
      });
      if (res.status === 201) {
        toast.success('Comment posted !!');
        setContent('');
      }
    } catch (error) {
      toast.error('Failed to post comment');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Content */}
          <article className="lg:col-span-8 xl:col-span-9 min-w-0 overflow-hidden">
            <header className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={blog.author.image || undefined} />
                  <AvatarFallback>{blog.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{blog.author.username}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <time dateTime={blog.createdAt} className="truncate">{publishDate}</time>
                    <span>•</span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Clock className="h-4 w-4" />
                      <span>{readingTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 break-words leading-tight">
                {blog.title}
              </h1>
            </header>

            {/* Article Content with proper overflow handling */}
            <div className="prose dark:prose-invert max-w-none prose-lg overflow-hidden">
              <div className="break-words overflow-wrap-anywhere">
                {renderContent()}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 pt-6 border-t">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`flex items-center gap-1 ${hasLiked ? 'text-red-500' : ''}`}
                  >
                    <Heart className="h-5 w-5" fill={hasLiked ? 'currentColor' : 'none'} />
                    <span>{likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setShowComment((prev) => !prev)}
                  >
                    <MessageSquareText className="h-5 w-5" />
                    <span>{comment.length}</span>
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </Button>
              </div>

              {/* Comment Section */}
              <CommentSection
                comments={comment}
                blogId={blog.id}
                blogAuthorId={blog.author.id}
                isBlogAuthor={isBlogAuthor}
                showComment={showComment}
                setShowComment={setShowComment}
              />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 min-w-0">
            <div className="sticky top-24 space-y-8">
              {/* Author Info Card */}
              <div className="bg-muted/50 p-6 rounded-lg overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-14 w-14 flex-shrink-0">
                    <AvatarImage src={blog.author.image || undefined} />
                    <AvatarFallback>{blog.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{blog.author.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      {blog.author.blog?.length + 1 || 0} articles
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  Writer passionate about technology and development
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Follow
                </Button>
              </div>

              {/* More Articles Card */}
              {hasAuthorBlogs && (
                <div className="bg-muted/50 p-6 rounded-lg overflow-hidden">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">More from {blog.author.username}</span>
                  </h3>
                  <ul className="space-y-3">
                    {blog.author.blog.map((authorBlog) => (
                      <li key={authorBlog.id}>
                        <Link
                          href={`${authorBlog.id}`}
                          className="text-sm hover:text-primary transition-colors block overflow-hidden"
                        >
                          <span className="line-clamp-2 break-words">
                            {authorBlog.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Page;
