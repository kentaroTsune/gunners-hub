import { translateText } from '../api/fetchTranslate';
import type { Article } from '../types/article';

export interface RawArticle {
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

// カテゴリーを正規化（文字列 or 配列 → 小文字の配列）
const normalizeCategory = (category: string | string[]): string[] => {
  return Array.isArray(category)
    ? category.map((cat: string) => cat.toLowerCase())
    : [String(category).toLowerCase()];
};

// 単一のRawArticleをArticleに変換（翻訳なし）
export const transformRawArticleToArticle = (item: RawArticle): Omit<Article, 'translatedTitle'> => {
  return {
    article_id: item.article_id,
    title: item.title,
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
    category: normalizeCategory(item.category),
    duplicate: item.duplicate || false,
    isFavorite: false,
  };
};

// 翻訳付きでRawArticleをArticleに変換
export const transformRawArticleWithTranslation = async (item: RawArticle): Promise<Article> => {
  const baseArticle = transformRawArticleToArticle(item);

  let translatedTitle = '';
  try {
    translatedTitle = await translateText(item.title);
  } catch (error) {
    console.warn(`翻訳エラー "${item.title}": ${String(error)}`);
  }

  return {
    ...baseArticle,
    title: translatedTitle || item.title,
    translatedTitle
  };
};

// 複数のRawArticleを翻訳付きArticleに一括変換
export const transformRawArticlesToArticles = async (rawArticles: RawArticle[]): Promise<Article[]> => {
  return await Promise.all(
    rawArticles.map(transformRawArticleWithTranslation)
  );
};

// 翻訳なしで複数のRawArticleをArticleに一括変換
export const transformRawArticlesToArticlesWithoutTranslation = (rawArticles: RawArticle[]): Omit<Article, 'translatedTitle'>[] => {
  return rawArticles.map(transformRawArticleToArticle);
};