export interface BlogCategory {
  id: string;
  label: string;
  rank: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  keywords: string;
  content?: string;
  contentPublic?: string;
  status: "published" | "draft" | "scheduled";
  publishedDate: string;
  blogCategorie: BlogCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesListResponse {
  articles: Article[];
  total: number;
}

export interface ArticleResponse extends Article {
  content: string;
}
