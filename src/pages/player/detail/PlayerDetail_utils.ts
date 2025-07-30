import { DEFAULT_PLAYER_STATS } from '../../../constants';
import type { PlayerEditData } from '../../../types/player';

// プレイヤーデータを編集用データに変換
export const createEditDataFromPlayer = (player: any): PlayerEditData => {
  return {
    name: player?.name || '',
    position: player?.position || '',
    nationality: player?.nationality || '',
    image: player?.image || '',
    bio: player?.bio || '',
    stats: player?.stats || DEFAULT_PLAYER_STATS
  };
};

// 編集データの変更を検知
export const hasDataChanges = (original: PlayerEditData, current: PlayerEditData): boolean => {
  return (
    original.name !== current.name ||
    original.position !== current.position ||
    original.nationality !== current.nationality ||
    original.bio !== current.bio ||
    original.stats.appearances !== current.stats.appearances ||
    original.stats.goals !== current.stats.goals ||
    original.stats.assists !== current.stats.assists
  );
};

// 数値入力の正規化（0以上の整数）
export const normalizeStatValue = (value: string): number => {
  return Math.max(0, parseInt(value) || 0);
};

// アラート表示のヘルパー
export const showAlert = {
  noPlayer: () => alert("選手情報が取得できません"),
  noChanges: () => alert("変更がありません"),
  saveSuccess: () => alert("保存しました！"),
  saveError: () => alert('保存に失敗しました。もう一度お試しください。'),
};