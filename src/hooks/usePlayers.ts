import { useState, useEffect } from 'react';
import type { Player } from '../types/player';
import { fetchPlayers } from '../services/players';

export const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const data = await fetchPlayers();
        setPlayers(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await fetchPlayers(true);
      setPlayers(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { players, loading, error, refresh };
}