import type { FootballApiResponse } from "../types/player";
import { API_ENDPOINTS } from "../constants";

export const fetchPlayer = async (teamId: number): Promise<FootballApiResponse> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.FOOTBALL}/${teamId}`);

    if (!response.ok) {
      throw new Error(`APIデータ取得エラー: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Football API通信エラー: ${String(error)}`);
  }
};