import type { PlayerStats } from '../types/player';

export const DEFAULT_PLAYER_STATS: PlayerStats = {
  appearances: 0,
  goals: 0,
  assists: 0,
} as const;
