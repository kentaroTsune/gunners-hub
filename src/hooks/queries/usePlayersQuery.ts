import { useQuery } from "@tanstack/react-query";
import { FOOTBALL_CONFIG } from "../../constants"
import { QUERY_KEYS, STALE_TIME } from "../../constants/queries"
import { transformFootballApiToPlayers } from "../../utils/playerTransformer";
import { fetchPlayer } from "../../api/fetchPlayer";
import type { Player } from "../../types/player";

export const usePlayersQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PLAYERS],
    queryFn: async (): Promise<Player[]> => {
      const data = await fetchPlayer(FOOTBALL_CONFIG.ARSENAL_TEAM_ID);
      return await transformFootballApiToPlayers(data);
    },
    staleTime: STALE_TIME.PLAYERS,
  });
};

export const usePlayersWithRefresh = () => {
  const query = usePlayersQuery();

  const refresh = () => query.refetch();

  return {
    ...query,
    players: query.data || [],
    refresh,
  };
};
