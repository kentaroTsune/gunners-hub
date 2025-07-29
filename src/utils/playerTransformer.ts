import { translateText } from '../api/fetchTranslate';
import type { FootballApiResponse, Player } from '../types/player';

interface RawPlayer {
  id: string;
  name: string;
  nationality: string;
  position: string;
}

// APIレスポンスをRawPlayerに変換
const transformApiResponseToRawPlayers = (data: FootballApiResponse): RawPlayer[] => {
  return data.squad.map(player => ({
    id: player.id.toString(),
    name: player.name,
    nationality: player.nationality || '不明',
    position: player.position || '不明',
  }));
};

// RawPlayerを翻訳済みPlayerに変換
const transformRawPlayersToPlayers = async (rawPlayers: RawPlayer[]): Promise<Player[]> => {
  return await Promise.all(
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
};

export const transformFootballApiToPlayers = async (data: FootballApiResponse): Promise<Player[]> => {
  const rawPlayers = transformApiResponseToRawPlayers(data);
  return await transformRawPlayersToPlayers(rawPlayers);
};