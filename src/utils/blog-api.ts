import type { ArticlesListResponse, ArticleResponse } from "../types/blog";

const API_URL = import.meta.env.PUBLIC_WISPRA_API_URL || "https://api.wispra.fr";
const PUBLIC_CODE = import.meta.env.PUBLIC_WISPRA_BLOG_API_KEY;

export async function getArticles(): Promise<ArticlesListResponse> {
  const response = await fetch(
    `${API_URL}/blog/public/${PUBLIC_CODE}/articles`,
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
  return await response.json();
}

export async function getArticle(slug: string): Promise<ArticleResponse> {
  const response = await fetch(
    `${API_URL}/blog/public/${PUBLIC_CODE}/articles/${slug}`,
    { headers: { "Content-Type": "application/json" } }
  );
  if (!response.ok) {
    if (response.status === 404) throw new Error("Article non trouvé");
    throw new Error(`Erreur API: ${response.status}`);
  }
  return await response.json();
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
