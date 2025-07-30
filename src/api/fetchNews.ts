import { apikey, category, endpoint, qInTitle, rawLang } from '../constants';
import type { RawArticle } from '../utils/newsTransformer';

interface NewsApiResponse {
  results: RawArticle[];
  nextPage?: string;
  totalResults?: number;
}

export const fetchNews = async (): Promise<RawArticle[]> => {

  if (!endpoint || !apikey || !qInTitle || !rawLang || !category) {
    throw new Error('ニュースAPIに必要な環境変数が不足しています');
  }

  const params = new URLSearchParams({
    apikey,
    qInTitle,
    language: decodeURIComponent(rawLang),
    category,
  });

  try {
    const response = await fetch(`${endpoint}?${params}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTPエラー ステータス: ${response.status}`);
    }

    const data: NewsApiResponse = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('無効なAPIレスポンス形式');
    }

    return data.results;
  } catch (error) {
    throw new Error(`ニュースAPI通信エラー: ${String(error)}`);
  }
};