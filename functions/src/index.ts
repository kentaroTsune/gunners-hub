// functions/src/index.ts
import { onRequest } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions';

interface TranslationRequest {
  text: string;
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

// DeepL API Function
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