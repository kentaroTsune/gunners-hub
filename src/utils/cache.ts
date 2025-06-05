import type { Article, CachedArticles } from '../types/article';

export const CACHE_KEY = 'arsenal-news-cache';
const CACHE_EXPIRE_MS = 60 * 60 * 1000; // 1時間

export const getCachedArticles = (): CachedArticles | null => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  
  try {
    const parsed = JSON.parse(cached) as CachedArticles;
    // キャッシュが有効期限内か確認
    if (Date.now() - parsed.timestamp < CACHE_EXPIRE_MS) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
};

export const setCachedArticles = (articles: Article[]): void => {
  const cache: CachedArticles = {
    timestamp: Date.now(),
    data: articles
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const clearCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
};
