export const CACHE_DURATION = {
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

export const CACHE_TYPES = {
  NEWS: 'news',
  PLAYERS: 'players',
} as const;

export const CACHE_KEYS = {
  NEWS: 'arsenal-news-cache',
  PLAYERS: 'arsenal-players-cache',
} as const;

export const CACHE_EXPIRY = {
  NEWS: CACHE_DURATION.ONE_HOUR,
  PLAYERS: CACHE_DURATION.ONE_WEEK,
} as const;