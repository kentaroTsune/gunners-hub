import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePlayerData } from '../../repositories/playerRepository';
import { QUERY_KEYS } from '../../constants/queries';
import type { PlayerEditData } from '../../types/player';

export const usePlayerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ playerId, data }: { playerId: string; data: PlayerEditData }) => {
      await updatePlayerData(playerId, data);
    },
    onSuccess: (_, { playerId }) => {
      // 関連するキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYER_DETAIL, playerId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PLAYERS] });
    },
    onError: (error) => {
      console.error('プレイヤー更新エラー:', error);
    },
  });
};