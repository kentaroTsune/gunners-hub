import { fetchNews } from '../api/fetchNews';
import { getCachedArticles, setCachedArticles } from '../utils/cache';
import { transformRawArticlesToArticles } from '../utils/newsTransformer';
import type { Article } from '../types/article';

export const getNews = async (forceRefresh = false): Promise<Article[]> => {
  // キャッシュから取得（強制更新でない場合）
  if (!forceRefresh) {
    const cached = getCachedArticles();
    if (cached) {
      return cached.data;
    }
  }

  try {
    const rawArticles = await fetchNews();
    const articles = await transformRawArticlesToArticles(rawArticles);

    // キャッシュに保存
    setCachedArticles(articles);

    return articles;
  } catch (error) {
    const cached = getCachedArticles();
    if (cached) {
      console.warn(`ニュース取得エラー、キャッシュを使用: ${String(error)}`);
      return cached.data;
    }
    throw new Error(`ニュース取得エラー: ${String(error)}`);
  }
};