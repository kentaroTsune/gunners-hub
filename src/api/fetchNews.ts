import { translateText } from './translate';
import { getCachedArticles, setCachedArticles } from '../utils/cache';
import type { Article } from '../types/article';

interface RawArticle {
  article_id: string;
  title: string;
  link: string;
  keywords?: string[];
  creator?: string[];
  description?: string;
  content?: string;
  pubDate: string;
  pubDateTZ?: string;
  image_url?: string | null;
  video_url?: string | null;
  source_id: string;
  source_name: string;
  source_priority?: number;
  source_url: string;
  source_icon: string;
  language?: string;
  country?: string[];
  category: string | string[];
  duplicate?: boolean;
}

export const fetchNews = async (forceRefresh = false): Promise<Article[]> => {
  // キャッシュから取得（強制更新でない場合）
  if (!forceRefresh) {
    const cached = getCachedArticles();
    if (cached) {
      return cached.data;
    }
  }

  const {
    VITE_RSS_ENDPOINT: endpoint,
    VITE_API_KEY: apikey,
    VITE_API_QUERY_Q: qInTitle,
    VITE_API_QUERY_LANGUAGE: rawLang,
    VITE_API_QUERY_CATEGORY: category,
  } = import.meta.env;

  if (!endpoint || !apikey || !qInTitle || !rawLang || !category) {
    throw new Error('Required environment variables are missing for news API');
  }

  const params = new URLSearchParams({
    apikey,
    qInTitle,
    language: decodeURIComponent(rawLang),
    category,
  });

  const res = await fetch(`${endpoint}?${params}`, {
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  const data = await res.json();

  if (!data.results || !Array.isArray(data.results)) {
    throw new Error('Invalid API response format');
  }

  // dataをArticle型に変換
  const articles: Article[] = await Promise.all(
    data.results.map(async (item: RawArticle) => {
      let translatedTitle = '';
      try {
        translatedTitle = await translateText(item.title);
      } catch (error) {
        throw new Error(`translation error: ${String(error)}`);
      }

      return {
        article_id: item.article_id,
        title: translatedTitle || item.title,
        link: item.link,
        keywords: item.keywords || [],
        creator: item.creator || [],
        description: item.description || '',
        content: item.content || '',
        pubDate: item.pubDate,
        pubDateTZ: item.pubDateTZ || 'UTC',
        image_url: item.image_url || null,
        video_url: item.video_url || null,
        source_id: item.source_id,
        source_name: item.source_name,
        source_priority: item.source_priority || 0,
        source_url: item.source_url,
        source_icon: item.source_icon,
        language: item.language || 'english',
        country: item.country || [],
        category: Array.isArray(item.category)
          ? item.category.map((cat: string) => cat.toLowerCase())
          : [String(item.category).toLowerCase()],
        duplicate: item.duplicate || false,
        isFavorite: false,
        translatedTitle
      };
    })
  );

  // キャッシュに保存
  setCachedArticles(articles);

  return articles;
};
