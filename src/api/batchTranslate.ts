import { TRANSLATION_CONFIG } from "../constants";
import { getApiBaseUrl } from "./apiBaseUrl";

interface BatchFunctionResponse {
  translatedTexts: string[];
}

interface BatchFunctionRequest {
  texts: string[];
  targetLang: string;
}

export const batchTranslateTexts = async (texts: string[]): Promise<string[]> => {
  if (!texts || texts.length === 0) return texts;
  if (texts.every(text => !text || !text.trim())) return texts;

  try {
    const functionUrl = `${getApiBaseUrl()}/api/batch-translate`;

    const requestBody: BatchFunctionRequest = {
      texts,
      targetLang: TRANSLATION_CONFIG.TARGET_LANGUAGE,
    };

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`バッチ翻訳が失敗しました: ${response.status}`);
    }

    // サーバーエラー時のクラッシュを防ぐための処理
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`バッチ翻訳: 予期しないレスポンス形式`);
    }

    const data: BatchFunctionResponse = await response.json();

    return data.translatedTexts;

  } catch (error) {
    console.error(`バッチ翻訳エラー:`, error);

    return texts;
  }
};