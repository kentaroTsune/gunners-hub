import type { FootballApiResponse } from "../types/player";

interface FootballFunctionRequest {
  teamId: number;
}

export const fetchPlayer = async (teamId: number): Promise<FootballApiResponse> => {
  try {
    // Firebase Functions URL
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
      const errorText = await response.text();
      throw new Error(`Football Function エラー: ${response.status} - ${errorText}`);
    }

    const data: FootballApiResponse = await response.json();
    return data;

  } catch (error) {
    console.error(`Football API通信エラー:`, error);
    throw new Error(`Football API通信エラー: ${String(error)}`);
  }
};