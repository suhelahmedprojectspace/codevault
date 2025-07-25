"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./CommentItem";
import toast from "react-hot-toast";
import axios from "@/lib/axios";
import { CommentSectionProps } from "@/types/blog";


export const CommentSection = ({ 
  comments, 
  blogId, 
  blogAuthorId, 
  isBlogAuthor,
  showComment,
  setShowComment
}: CommentSectionProps) => {
  const [content, setContent] = useState('');

  const handlePostComment = async () => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      const res = await axios.post('/comment', {
        content,
        blogId
      });
      if (res.status === 201) {
        toast.success("Comment posted!");
        setContent('');
        setShowComment(false);
      }
    } catch (error) {
      toast.error("Failed to post comment");
      console.error(error);
    }
  };

  return (
    <div>
      {showComment && (
        <Card className="p-4 mt-4 space-y-4">
          <Textarea
            placeholder="Write your comment..."
            className="w-full"
            value={content}
            disabled={isBlogAuthor}
            onChange={(e) => setContent(e.target.value)}
          />
          {isBlogAuthor && (
            <p className="text-sm text-red-500">You can't comment on your own post.</p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowComment(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePostComment}
              disabled={isBlogAuthor || !content.trim()}
            >
              Post Comment
            </Button>
          </div>
        </Card>
      )}

      {comments.length > 0 && (
        <Card className="p-4 mt-6">
          <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                blogId={blogId}
                blogAuthorId={blogAuthorId}
                onReply={() => {}}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};