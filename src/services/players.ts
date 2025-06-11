import { getCachedPlayers, setCachedPlayers } from '../utils/cache';
import type { Player } from '../types/player';

interface FootballApiResponse {
  squad: Array<{
    id: number;
    name: string;
    position?: string;
    dateOfBirth?: string;
    nationality?: string;
    shirtNumber?: number;
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

    console.log(data);

    // 必要なデータのみ取得
    const players = data.squad.map(player => ({
      id: player.id.toString(),
      name: player.name,
      position: player.position || '不明',
    }));

    setCachedPlayers(players);
    return players;
  } catch (error) {
    console.log('選手データ取得失敗:', error);
    const cached = getCachedPlayers();
    if (cached) return cached;
    throw error;
  }
}