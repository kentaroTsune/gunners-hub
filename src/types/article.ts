export interface CachedArticles {
  timestamp: number;
  data: Article[];
}

export interface Article {
  article_id: string;
  title: string;
  link: string;
  keywords: string[];
  creator: string[];
  description: string;
  content: string;
  pubDate: string;
  pubDateTZ: string;
  image_url: string | null;
  video_url: string | null;
  source_id: string;
  source_name: string;
  source_priority: number;
  source_url: string;
  source_icon: string;
  language: string;
  country: string[];
  category: string[];
  duplicate: boolean;
  isFavorite: boolean;
  translatedTitle?: string;
  translatedContent?: string;
  isTranslating?: boolean;
}
