import { batchTranslateTexts } from '../api/batchTranslate';
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
  if (!rawPlayers || rawPlayers.length === 0) {
    return [];
  }

  try {
    // 全ての選手名を配列として抽出
    const playerNames = rawPlayers.map(player => player.name);

    // バッチ翻訳実行
    const translatedNames = await batchTranslateTexts(playerNames);

    // 翻訳された名前を使用してPlayer配列を作成
    return rawPlayers.map((player, index) => ({
      id: player.id,
      name: translatedNames[index] || player.name,
      nationality: player.nationality,
      position: player.position,
    }));

  } catch (error) {
    console.error('選手名バッチ翻訳エラー:', error);

    // エラー時は元の名前をそのまま使用
    return rawPlayers.map(player => ({
      id: player.id,
      name: player.name,
      nationality: player.nationality,
      position: player.position,
    }));
  }
};

export const transformFootballApiToPlayers = async (data: FootballApiResponse): Promise<Player[]> => {
  const rawPlayers = transformApiResponseToRawPlayers(data);
  return await transformRawPlayersToPlayers(rawPlayers);
};