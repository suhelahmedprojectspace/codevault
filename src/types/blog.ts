export interface Author {
  id: string;
  username: string;
  image: string | null;
}

export interface BlogAuthor extends Author {
  blog: Array<{
    id: string;
    title: string;
  }>;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  visibility: string;
  author: BlogAuthor;
  likes: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  replies: Comment[];
  blogId: string;
  parentId: string | null;
}

export interface CommentItemProps {
  comment: Comment;
  blogId:string;
  blogAuthorId: string;
  isBlogAuthor?:boolean;
  onReply: (commentId: string) => void;
  depth?: number;
  isCurrentUser?:boolean;
}

export interface CommentSectionProps {
  comments: Comment[];
  blogId: string;
  blogAuthorId: string;
  isBlogAuthor: boolean;
  showComment: boolean;
  setShowComment: (show: boolean) => void;
}