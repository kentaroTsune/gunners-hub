import { useState, useEffect } from 'react';
import type { Player } from '../types/player';
import { fetchPlayers } from '../services/players';

interface UsePlayersReturn {
  players: Player[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const usePlayers = (): UsePlayersReturn => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlayers = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPlayers(forceRefresh);
      setPlayers(data);
    } catch (err) {
      const errorMessage = `選手一覧取得エラー: ${String(err)}`;
      setError(errorMessage);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const refresh = async () => {
    await loadPlayers(true);
  };

  return { players, loading, error, refresh };
};