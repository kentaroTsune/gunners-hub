import { TRANSLATION_CONFIG, API_ENDPOINTS } from "../constants";
import { deeplApiKey } from "../constants/api";

interface TranslationResponse {
  translations: {
    detected_source_language: string;
    text: string;
  }[];
}

interface TranslationRequest {
  text: string[];
  target_lang: string;
  auth_key: string;
}

export const translateText = async (text: string): Promise<string> => {
  if (!text.trim()) return text;

  if (!deeplApiKey) {
    console.warn('DeepL API キーが設定されていません。翻訳をスキップします。');
    return text;
  }

  try {
    const requestBody: TranslationRequest = {
      auth_key: deeplApiKey,
      text: [text],
      target_lang: TRANSLATION_CONFIG.TARGET_LANGUAGE,
    };

    const response = await fetch(API_ENDPOINTS.TRANSLATE, {
      method: TRANSLATION_CONFIG.REQUEST_METHOD,
      headers: {
        'Content-Type': TRANSLATION_CONFIG.CONTENT_TYPE
      },
      body: JSON.stringify(requestBody)
    });

    // レスポンスのContent-Typeチェック
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      console.error('翻訳API: JSON以外のレスポンス:', responseText.slice(0, 200));
      throw new Error(`翻訳API: 予期しないレスポンス形式 (${contentType})`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('翻訳API エラーレスポンス:', errorText);
      throw new Error(`翻訳APIが失敗しました: ${response.status} ${response.statusText}`);
    }

    const data: TranslationResponse = await response.json();

    if (!data.translations || !Array.isArray(data.translations) || data.translations.length === 0) {
      console.error('翻訳API: 無効なレスポンス構造:', data);
      throw new Error('無効な翻訳レスポンス形式です');
    }

    return data.translations[0].text;
  } catch (error) {
    throw new Error(`翻訳エラー: "${text.slice(0, 20)}...": ${String(error)}`);
  }
};
