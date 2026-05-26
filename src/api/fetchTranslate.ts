import { TRANSLATION_CONFIG } from "../constants";
import { getApiBaseUrl } from "./apiBaseUrl";

interface FunctionResponse {
  translatedText: string;
  detectedLanguage?: string;
}

interface FunctionRequest {
  text: string;
  targetLang: string;
}

export const translateText = async (text: string): Promise<string> => {
  if (!text.trim()) return text;

  try {
    const functionUrl = `${getApiBaseUrl()}/api/translate`;

    const requestBody: FunctionRequest = {
      text,
      targetLang: TRANSLATION_CONFIG.TARGET_LANGUAGE,
    };

    const response = await fetch(functionUrl, {
      method: TRANSLATION_CONFIG.REQUEST_METHOD,
      headers: {
        'Content-Type': TRANSLATION_CONFIG.CONTENT_TYPE
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      if (response.status === 500) {
        console.warn(`翻訳制限到達、元テキスト使用: "${text.slice(0, 30)}..."`);
        return text;
      }
      throw new Error(`翻訳が失敗しました: ${response.status}`);
    }

    // サーバーエラー時のクラッシュを防ぐための処理
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`翻訳: 予期しないレスポンス形式`);
    }

    const data: FunctionResponse = await response.json();

    return data.translatedText;

  } catch (error) {
    console.error(`翻訳エラー、元テキスト使用: ${String(error)}`);

    return text;
  }
};