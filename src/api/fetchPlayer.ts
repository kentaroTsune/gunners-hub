import type { FootballApiResponse } from "../types/player";

export const fetchPlayer = async (teamId: number): Promise<FootballApiResponse> => {
  try {
    const response = await fetch(`/api/football/teams/${teamId}`);

    if (!response.ok) {
      throw new Error(`APIデータ取得エラー: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Football API通信エラー: ${String(error)}`);
  }
};