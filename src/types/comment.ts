export interface CommentAuthor {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

export interface Comment {
  id: number;
  content: string;
  timestamp: string;
  userId: number;
  postId: number;
  user: CommentAuthor;
  likesCount: number;
  likedByMe: boolean;
}

export interface RecentComment {
  id: number;
  content: string;
  timestamp: string;
  user: {
    username: string;
    firstName: string;
    lastName: string;
  };
  post: {
    id: number;
    title: string;
  };
  likesCount: number;
}