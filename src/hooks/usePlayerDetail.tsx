import type { Player } from '../types/player';
import playersData from '../data/players.json';

interface UsePlayerDetailResult {
  player: (Player & { imageUrl: string }) | null;
}

export const usePlayerDetail = (id: string): UsePlayerDetailResult => {

  // JSONデータから該当選手を検索
  const playerData = playersData.players.find(p => p.id === id);
  if (!playerData) {
    console.warn(`Player with id ${id} not found`);
    return { player: null };
  }

  // 画像URLを生成
  const imageUrl = `/src/assets/img/${playerData.image}`;

  return {
    player: {
      ...playerData,
      imageUrl
    }
  };
};