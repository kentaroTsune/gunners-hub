// src/api/fetchTranslate.ts
import { TRANSLATION_CONFIG } from "../constants";

interface FunctionResponse {
  translatedText: string;
  detectedLanguage?: string;
}

interface FunctionRequest {
  text: string;
  targetLang: string;
}

// リクエスト間隔制御
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 100; // 100ms間隔

export const translateText = async (text: string): Promise<string> => {
  if (!text.trim()) return text;

  try {
    // リクエスト間隔制御
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    lastRequestTime = Date.now();

    const functionUrl = `https://translatetext-ndfr76tzaq-uc.a.run.app`;

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

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`翻訳Function: 予期しないレスポンス形式`);
    }

    if (!response.ok) {
      // 429エラーの場合は元のテキストを返す（サイレントフォールバック）
      if (response.status === 500) {
        console.warn(`翻訳制限到達、元テキスト使用: "${text.slice(0, 30)}..."`);
        return text;
      }
      throw new Error(`翻訳Functionが失敗しました: ${response.status}`);
    }

    const data: FunctionResponse = await response.json();

    if (!data.translatedText) {
      throw new Error('無効な翻訳レスポンス形式です');
    }

    return data.translatedText;
  } catch (error) {
    console.error(`翻訳エラー、元テキスト使用: ${String(error)}`);
    return text; // エラー時は元のテキストを返す
  }
};