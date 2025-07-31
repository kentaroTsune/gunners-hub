import { CACHE_DURATION } from '../constants/cache';

export const QUERY_KEYS = {
  PLAYERS: 'players',
  PLAYER_DETAIL: 'playerDetail',
  NEWS: 'news',
  FAVORITES: 'favorites',
} as const;

export const STALE_TIME = {
  PLAYERS: CACHE_DURATION.ONE_WEEK,    // 選手データは1週間
  NEWS: CACHE_DURATION.ONE_HOUR,       // ニュースは1時間
  PLAYER_DETAIL: CACHE_DURATION.ONE_DAY, // 選手詳細は1日
  FAVORITES: CACHE_DURATION.ONE_HOUR,   // お気に入りは1時間
} as const;