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

interface RawPlayer {
  id: string;
  name: string;
  nationality: string;
  position: string;
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

    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status}`);
    }

    const data: FootballApiResponse = await response.json();

    // 必要なデータのみ取得して正規化
    const rawPlayers: RawPlayer[] = data.squad.map(player => ({
      id: player.id.toString(),
      name: player.name,
      nationality: player.nationality || '不明',
      position: player.position || '不明',
    }));

    // 翻訳処理を含むPlayer型への変換
    const playersData: Player[] = await Promise.all(
      rawPlayers.map(async (player: RawPlayer) => {
        let translatedName = '';
        try {
          translatedName = await translateText(player.name);
        } catch (error) {
          console.warn(`選手名翻訳エラー "${player.name}": ${String(error)}`);
        }

        return {
          id: player.id,
          name: translatedName || player.name,
          nationality: player.nationality,
          position: player.position,
        };
      })
    );

    setCachedPlayers(playersData);
    return playersData;
  } catch (error) {
    // エラー時はキャッシュがあれば返す
    const cached = getCachedPlayers();
    if (cached) {
      console.warn(`選手データ取得エラー、キャッシュを使用: ${String(error)}`);
      return cached;
    }
    throw new Error(`選手データ取得エラー: ${String(error)}`);
  }
}