interface TranslationResponse {
  translations: {
    detected_source_language: string;
    text: string;
  }[];
}

export const translateText = async (text: string): Promise<string> => {
  try {
    const response = await fetch('/api/deepl/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: [text],
        target_lang: 'JA'
      })
    });

    if (!response.ok) {
      throw new Error(`Translation failed with status: ${response.status}`);
    }

    const data: TranslationResponse = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};
