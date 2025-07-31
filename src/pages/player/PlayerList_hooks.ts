import { usePlayersWithRefresh } from '../../hooks/queries/usePlayersQuery';
import type { Player } from '../../types/player';

interface UsePlayersReturn {
  players: Player[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const usePlayers = (): UsePlayersReturn => {
  const { players, isLoading: loading, error, refresh: queryRefresh } = usePlayersWithRefresh();

  const refresh = async (): Promise<void> => {
    await queryRefresh();
  };

  return {
    players,
    loading,
    error: error ? `選手一覧取得エラー: ${String(error)}` : null,
    refresh,
  };
};