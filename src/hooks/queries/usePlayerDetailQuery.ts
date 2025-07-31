import { useQuery } from '@tanstack/react-query';
import { fetchFirestorePlayer } from '../../repositories/playerRepository';
import { QUERY_KEYS, STALE_TIME } from '../../constants/queries';
import type { Player } from '../../types/player';

export const usePlayerDetailQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYER_DETAIL, id],
    queryFn: async (): Promise<Player | null> => {
      if (!id) return null;
      return await fetchFirestorePlayer(id);
    },
    staleTime: STALE_TIME.PLAYER_DETAIL,
    enabled: !!id,
  });
};