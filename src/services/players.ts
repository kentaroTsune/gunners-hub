import { getCachedPlayers, setCachedPlayers } from '../utils/cache';
import type { Player } from '../types/player';
import { translateText } from '../api/translate';

interface FootballApiResponse {
  squad: Array<{
    id: number;
    name: string;
    position?: string;
    nationality?: string;
  }>;
}

export const fetchPlayers = async (forceRefresh = false): Promise<Player[]> => {
  // キャッシュから取得(強制更新でない場合)
  if (!forceRefresh) {
    const cached = getCachedPlayers();
    if (cached) return cached;
  }

  try {
    // プロキシ経由で取得
    const response = await fetch('/api/football/teams/57');

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data: FootballApiResponse = await response.json();

    // 必要なデータのみ取得
    const players = data.squad.map(player => ({
      id: player.id.toString(),
      name: player.name,
      nationality: player.nationality || '不明',
      position: player.position || '不明',
    }));

    const playersData = await Promise.all(
      players.map(async (player: any) => {
        let translatedName = '';
        try {
          translatedName = await translateText(player.name);
        } catch (error) {
          console.warn('選手名翻訳失敗:', error);
        }

        return {
          id: player.id.toString(),
          name: translatedName || player.name,
          nationality: player.nationality || '不明',
          position: player.position || '不明',
        }
      })
    );

    setCachedPlayers(playersData);
    return playersData;
  } catch (error) {
    console.log('選手データ取得失敗:', error);
    const cached = getCachedPlayers();
    if (cached) return cached;
    throw error;
  }
}