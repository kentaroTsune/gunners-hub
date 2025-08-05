// functions/src/index.ts
import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';

interface TranslationRequest {
  text: string;
  targetLang?: string;
}

interface BatchTranslationRequest {
  texts: string[];
  targetLang?: string;
}

interface DeepLResponse {
  translations: {
    detected_source_language: string;
    text: string;
  }[];
}

interface FootballRequest {
  teamId: number;
}

// 単一翻訳Function
export const translateText = onRequest({
  cors: true,
  secrets: ["DEEPL_API_KEY"],
}, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { text, targetLang = 'JA' }: TranslationRequest = req.body;

    if (!text || !text.trim()) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        target_lang: targetLang,
        auth_key: process.env.DEEPL_API_KEY,
      }),
    });

    if (!deeplResponse.ok) {
      logger.error('DeepL API Error:', deeplResponse.status, deeplResponse.statusText);
      res.status(500).json({ error: 'Translation service error' });
      return;
    }

    const data: DeepLResponse = await deeplResponse.json();

    if (!data.translations || data.translations.length === 0) {
      res.status(500).json({ error: 'Invalid translation response' });
      return;
    }

    const translatedText = data.translations[0].text;

    res.json({
      translatedText,
      detectedLanguage: data.translations[0].detected_source_language
    });
  } catch (error) {
    logger.error('Translation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// バッチ翻訳Function
export const batchTranslateText = onRequest({
  cors: true,
  secrets: ["DEEPL_API_KEY"],
}, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { texts, targetLang = 'JA' }: BatchTranslationRequest = req.body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      res.status(400).json({ error: 'Texts array is required' });
      return;
    }

    // 空のテキストを除外し、元のインデックスを保持
    const validTexts = texts.filter(text => text && text.trim());

    if (validTexts.length === 0) {
      res.json({ translatedTexts: texts }); // 元のテキストをそのまま返す
      return;
    }

    logger.info('バッチ翻訳リクエスト:', {
      total: texts.length,
      valid: validTexts.length,
      targetLang
    });

    // DeepL APIは最大50テキストまで対応
    const batchSize = 50;
    const allTranslations: string[] = [];

    for (let i = 0; i < validTexts.length; i += batchSize) {
      const batch = validTexts.slice(i, i + batchSize);

      try {
        const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: batch,
            target_lang: targetLang,
            auth_key: process.env.DEEPL_API_KEY,
          }),
        });

        if (!deeplResponse.ok) {
          logger.error(`DeepL API Error (batch ${i}):`, deeplResponse.status, deeplResponse.statusText);

          // レート制限の場合は元のテキストを使用
          if (deeplResponse.status === 429) {
            logger.warn(`DeepL APIレート制限 (batch ${i}), 元テキスト使用`);
            allTranslations.push(...batch); // 元のテキストを追加
            continue;
          }

          throw new Error(`DeepL API error: ${deeplResponse.status}`);
        }

        const data: DeepLResponse = await deeplResponse.json();

        if (!data.translations || data.translations.length === 0) {
          logger.warn(`無効なレスポンス (batch ${i}), 元テキスト使用`);
          allTranslations.push(...batch);
          continue;
        }

        const batchTranslations = data.translations.map(t => t.text);
        allTranslations.push(...batchTranslations);

        // バッチ間で少し待機（レート制限回避）
        if (i + batchSize < validTexts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (error) {
        logger.error(`バッチ翻訳エラー (batch ${i}):`, error);
        // エラー時は元のテキストを使用
        allTranslations.push(...batch);
      }
    }

    // 元の配列の順序で結果を再構築
    const result: string[] = new Array(texts.length);
    let translationIndex = 0;

    texts.forEach((originalText, index) => {
      if (originalText && originalText.trim()) {
        result[index] = allTranslations[translationIndex] || originalText;
        translationIndex++;
      } else {
        result[index] = originalText; // 空のテキストはそのまま
      }
    });

    logger.info('バッチ翻訳完了:', {
      requested: texts.length,
      translated: allTranslations.length
    });

    res.json({ translatedTexts: result });

  } catch (error) {
    logger.error('Batch translation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// football-data.org API Function
export const getFootballData = onRequest({
  cors: true,
  secrets: ["FOOTBALL_API_KEY"],
}, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { teamId }: FootballRequest = req.body;

    if (!teamId) {
      res.status(400).json({ error: 'Team ID is required' });
      return;
    }

    const footballResponse = await fetch(`https://api.football-data.org/v4/teams/${teamId}`, {
      method: 'GET',
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY || '',
      },
    });

    if (!footballResponse.ok) {
      logger.error('Football API Error:', footballResponse.status, footballResponse.statusText);
      const errorText = await footballResponse.text();
      res.status(500).json({
        error: 'Football API service error',
        details: {
          status: footballResponse.status,
          message: errorText
        }
      });
      return;
    }

    const data = await footballResponse.json();

    res.json(data);
  } catch (error) {
    logger.error('Football API処理エラー:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});