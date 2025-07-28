import { useEffect, useState } from 'react';
import { fetchFirestorePlayer } from '../repositories/playerRepository';
import type { Player } from '../types/player';

interface UsePlayerDetailReturn {
  player: Player | null;
  loading: boolean;
  error: string | null;
}

export const usePlayerDetail = (id: string): UsePlayerDetailReturn => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setPlayer(null);
      setLoading(false);
      setError(null);
      return;
    }

    const loadPlayer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFirestorePlayer(id);
        setPlayer(data);
      } catch (error) {
        const errorMessage = `選手詳細取得エラー ${id}: ${String(error)}`;
        setError(errorMessage);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, [id]);

  return { player, loading, error };
}