'use client';
import { useState } from 'react';
import { format } from 'date-fns';
import { Reply, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import axios from '@/lib/axios';
import { CommentItemProps } from '@/types/blog';

export const CommentItem = ({
  comment,
  blogId,
  blogAuthorId,
  onReply,
  depth = 0,
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(true);
  const isAuthor = comment.author.id === blogAuthorId;
  const isCurrentUser = comment.author.id === blogAuthorId;

  const replies = comment.replies || [];
  const hasReplies = replies.length > 0;

  const handlePostReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    try {
      const res = await axios.post('/comment', {
        content: replyContent,
        blogId,
        parentId: comment.id,
      });
      if (res.status === 201) {
        toast.success('Reply posted!');
        setReplyContent('');
        setIsReplying(false);
        onReply(comment.id);
      }
    } catch (error) {
      toast.error('Failed to post reply');
      console.error(error);
    }
  };

  return (
    <div className={`mt-4 ${depth > 0 ? 'ml-8 border-l-2 pl-4 border-muted' : ''}`}>
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={comment.author.image || undefined} />
          <AvatarFallback>{comment.author.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{comment.author.username}</span>
            {isAuthor && <Badge variant="secondary">Author</Badge>}
            {isCurrentUser && <Badge variant="outline">You</Badge>}
            <span className="text-sm text-muted-foreground">
              {format(new Date(comment.createdAt), 'MMM d, yyyy')}
            </span>
          </div>
          <p className="mt-1 text-sm">{comment.content}</p>
          <div className="mt-2 flex gap-2">
            {depth < 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-muted-foreground"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-muted-foreground"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show {replies.length} replies
                  </>
                )}
              </Button>
            )}
          </div>
          {isReplying && (
            <div className="mt-3">
              <Textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handlePostReply}>
                  Post Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showReplies && hasReplies && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              blogId={blogId}
              blogAuthorId={blogAuthorId}
              onReply={onReply}
              depth={depth + 1}
              isCurrentUser={isCurrentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
};
