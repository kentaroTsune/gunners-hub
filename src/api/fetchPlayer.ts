import type { FootballApiResponse } from "../types/player";

interface FootballFunctionRequest {
  teamId: number;
}

export const fetchPlayer = async (teamId: number): Promise<FootballApiResponse> => {
  try {
    const functionUrl = import.meta.env.VITE_FIREBASE_FOOTBALL_DATA;

    const requestBody: FootballFunctionRequest = {
      teamId,
    };

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '不明なエラー');
      throw new Error(`Football Function エラー: ${response.status} - ${errorText}`);
    }

    // サーバーエラー時のクラッシュを防ぐための処理
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Football Function: 予期しないレスポンス形式`);
    }

    const data: FootballApiResponse = await response.json();

    return data;

  } catch (error) {
    console.error(`Football API取得エラー:`, error);
    throw new Error(`Football API取得エラー: ${String(error)}`);
  }
};