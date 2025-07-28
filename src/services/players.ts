import { getCachedPlayers, setCachedPlayers } from '../utils/cache';
import { fetchPlayer } from '../api/fetchPlayer';
import { transformFootballApiToPlayers } from '../utils/playerTransformer';
import type { Player } from '../types/player';

const handlePlayerFetchError = (error: unknown): Player[] => {
  const cached = getCachedPlayers();
  if (cached) {
    console.warn(`選手データ取得エラー、キャッシュを使用: ${String(error)}`);
    return cached;
  }
  throw new Error(`選手データ取得エラー: ${String(error)}`);
};

export const getPlayer = async (forceRefresh = false): Promise<Player[]> => {
  // キャッシュから取得(強制更新でない場合)
  if (!forceRefresh) {
    const cached = getCachedPlayers();
    if (cached) return cached;
  }

  try {
    const data = await fetchPlayer(57);
    const playersData = await transformFootballApiToPlayers(data);

    setCachedPlayers(playersData);
    return playersData;
  } catch (error) {
    return handlePlayerFetchError(error);
  }
};
