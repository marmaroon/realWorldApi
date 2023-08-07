export interface Author {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Author;
}

export interface CommentResponseInterface {
  comment: Comment;
}
