import { useEffect, useState } from 'react';
import { fetchFirestorePlayer } from '../services/firestorePlayers';
import type { Player } from '../types/player';

export const usePlayerDetail = (id: string) => {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        setLoading(true);
        const data = await fetchFirestorePlayer(id);
        setPlayer(data);
      } catch (error) {
        console.error("Firestoreから選手データ取得失敗", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, [id]);

  return { player, loading };
}