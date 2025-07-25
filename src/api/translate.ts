interface TranslationResponse {
  translations: {
    detected_source_language: string;
    text: string;
  }[];
}

interface TranslationRequest {
  text: string[];
  target_lang: string;
}

const TRANSLATION_CONFIG = {
  API_ENDPOINT: '/api/deepl/v2/translate',
  TARGET_LANGUAGE: 'JA',
  REQUEST_METHOD: 'POST',
  CONTENT_TYPE: 'application/json',
} as const;

export const translateText = async (text: string): Promise<string> => {
  if (!text.trim()) return text;

  try {
    const requestBody: TranslationRequest = {
      text: [text],
      target_lang: TRANSLATION_CONFIG.TARGET_LANGUAGE
    };

    const response = await fetch(TRANSLATION_CONFIG.API_ENDPOINT, {
      method: TRANSLATION_CONFIG.REQUEST_METHOD,
      headers: {
        'Content-Type': TRANSLATION_CONFIG.CONTENT_TYPE
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`翻訳APIが失敗しました: ${response.status} ${response.statusText}`);
    }

    const data: TranslationResponse = await response.json();

    if (!data.translations || !Array.isArray(data.translations) || data.translations.length === 0) {
      throw new Error('無効な翻訳レスポンス形式です');
    }

    return data.translations[0].text;
  } catch (error) {
    throw new Error(`翻訳エラー: "${text.slice(0, 20)}...": ${String(error)}`);
  }
};
