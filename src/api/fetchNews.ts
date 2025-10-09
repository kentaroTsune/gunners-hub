import { apikey, category, endpoint, qInTitle, rawLang } from '../constants';
import type { RawArticle } from '../utils/newsTransformer';

interface NewsApiResponse {
  results: RawArticle[];
  nextPage?: string;
  totalResults?: number;
}

export const fetchNews = async (): Promise<RawArticle[]> => {
  if (!apikey || !category || !endpoint || !qInTitle || !rawLang) {
    throw new Error('ニュースAPIに必要な環境変数が不足しています');
  }

  // クエリ部分のカスタマイズ
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
      const errorText = await response.text().catch(() => '不明なエラー');
      throw new Error(
        `HTTPエラー ステータス: ${response.status}, 詳細: ${errorText}`
      );
    }

    const data: NewsApiResponse = await response.json();

    if (!data.results || !Array.isArray(data.results)) {
      throw new Error('無効なAPIレスポンス形式: results配列が存在しません');
    }

    if (data.results.length === 0) {
      console.warn('ニュース記事が0件です');
    }

    return data.results;

  } catch (error) {
    throw new Error(`ニュースAPI取得エラー: ${String(error)}`);
  }
};