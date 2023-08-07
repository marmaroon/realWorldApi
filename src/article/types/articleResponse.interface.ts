import { AuthorResponse } from './authorResponse';

export interface ArticleResponseInterface {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: Date;
    updatedAt: Date;
    favoritesCount: number;
    author: AuthorResponse;
  };
}
