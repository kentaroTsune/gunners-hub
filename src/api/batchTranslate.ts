import { TRANSLATION_CONFIG } from "../constants";

interface BatchFunctionResponse {
  translatedTexts: string[];
}

interface BatchFunctionRequest {
  texts: string[];
  targetLang: string;
}

export const batchTranslateTexts = async (texts: string[]): Promise<string[]> => {
  if (!texts || texts.length === 0) return texts;

  // 空のテキストのみの場合はそのまま返す
  if (texts.every(text => !text || !text.trim())) {
    return texts;
  }

  try {
    const functionUrl = import.meta.env.VITE_FIREBASE_BATCH_TRANSLATE_TEXT;

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

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`バッチ翻訳: 予期しないレスポンス形式`);
    }

    if (!response.ok) {
      throw new Error(`バッチ翻訳が失敗しました: ${response.status}`);
    }

    const data: BatchFunctionResponse = await response.json();

    if (!data.translatedTexts || !Array.isArray(data.translatedTexts)) {
      throw new Error('無効なバッチ翻訳レスポンス形式です');
    }

    return data.translatedTexts;

  } catch (error) {
    console.error(`バッチ翻訳エラー:`, error);

    return texts;
  }
};