export interface Env {
  FOOTBALL_API_KEY: string;
  DEEPL_API_KEY: string;
}

interface DeepLResponse {
  translations: {
    detected_source_language: string;
    text: string;
  }[];
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function corsPreflightResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

async function handleFootball(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'このメソッドは許可されていません。' }, 405);
  }

  let body: { teamId?: number };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'JSONの解析に失敗しました。' }, 400);
  }

  const { teamId } = body;
  if (!teamId) {
    return jsonResponse({ error: 'チームIDが必要です。' }, 400);
  }

  if (!env.FOOTBALL_API_KEY) {
    return jsonResponse({ error: 'FOOTBALL_API_KEY が設定されていません。' }, 500);
  }

  const footballResponse = await fetch(
    `https://api.football-data.org/v4/teams/${teamId}`,
    {
      method: 'GET',
      headers: {
        'X-Auth-Token': env.FOOTBALL_API_KEY,
      },
    },
  );

  if (!footballResponse.ok) {
    const errorText = await footballResponse.text();
    return jsonResponse(
      {
        error: 'Football API サービスエラー',
        details: {
          status: footballResponse.status,
          message: errorText,
        },
      },
      500,
    );
  }

  const data = await footballResponse.json();
  return jsonResponse(data);
}

async function handleTranslate(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'このメソッドは許可されていません。' }, 405);
  }

  let body: { text?: string; targetLang?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'JSONの解析に失敗しました。' }, 400);
  }

  const { text, targetLang = 'JA' } = body;

  if (!text || !text.trim()) {
    return jsonResponse({ error: 'テキストが必要です' }, 400);
  }

  if (!env.DEEPL_API_KEY) {
    return jsonResponse({ error: 'DEEPL_API_KEY が設定されていません。' }, 500);
  }

  const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `DeepL-Auth-Key ${env.DEEPL_API_KEY}`,
    },
    body: JSON.stringify({
      text: [text],
      target_lang: targetLang,
    }),
  });

  if (!deeplResponse.ok) {
    return jsonResponse({ error: '翻訳サービスエラー' }, 500);
  }

  const data = (await deeplResponse.json()) as DeepLResponse;

  if (!data.translations || data.translations.length === 0) {
    return jsonResponse({ error: '無効な翻訳応答' }, 500);
  }

  return jsonResponse({
    translatedText: data.translations[0].text,
    detectedLanguage: data.translations[0].detected_source_language,
  });
}

async function handleBatchTranslate(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'このメソッドは許可されていません。' }, 405);
  }

  let body: { texts?: string[]; targetLang?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'JSONの解析に失敗しました。' }, 400);
  }

  const { texts, targetLang = 'JA' } = body;

  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    return jsonResponse({ error: 'テキスト配列は必須です。' }, 400);
  }

  if (!env.DEEPL_API_KEY) {
    return jsonResponse({ error: 'DEEPL_API_KEY が設定されていません。' }, 500);
  }

  const validTexts = texts.filter((text) => text && text.trim());

  if (validTexts.length === 0) {
    return jsonResponse({ translatedTexts: texts });
  }

  const batchSize = 50;
  const allTranslations: string[] = [];

  for (let i = 0; i < validTexts.length; i += batchSize) {
    const batch = validTexts.slice(i, i + batchSize);

    try {
      const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `DeepL-Auth-Key ${env.DEEPL_API_KEY}`,
        },
        body: JSON.stringify({
          text: batch,
          target_lang: targetLang,
        }),
      });

      if (!deeplResponse.ok) {
        if (deeplResponse.status === 429) {
          allTranslations.push(...batch);
          continue;
        }
        throw new Error(`DeepL API エラー: ${deeplResponse.status}`);
      }

      const data = (await deeplResponse.json()) as DeepLResponse;

      if (!data.translations || data.translations.length === 0) {
        allTranslations.push(...batch);
        continue;
      }

      allTranslations.push(...data.translations.map((t) => t.text));

      if (i + batchSize < validTexts.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch {
      allTranslations.push(...batch);
    }
  }

  const result: string[] = new Array(texts.length);
  let translationIndex = 0;

  texts.forEach((originalText, index) => {
    if (originalText && originalText.trim()) {
      result[index] = allTranslations[translationIndex] || originalText;
      translationIndex++;
    } else {
      result[index] = originalText;
    }
  });

  return jsonResponse({ translatedTexts: result });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return corsPreflightResponse();
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    try {
      switch (path) {
        case '/api/football':
          return await handleFootball(request, env);
        case '/api/translate':
          return await handleTranslate(request, env);
        case '/api/batch-translate':
          return await handleBatchTranslate(request, env);
        default:
          return jsonResponse({ error: 'Not Found' }, 404);
      }
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({ error: '内部サーバーエラー' }, 500);
    }
  },
};
