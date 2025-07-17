import type { Article, CachedArticles } from '../types/article';
import type { Player } from '../types/player';

const CACHE_DURATION = {
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

const CACHE_KEY_NEWS = 'arsenal-news-cache';
const CACHE_KEY_PLAYERS = 'arsenal-players-cache';
const NEWS_CACHE_EXPIRE_MS = CACHE_DURATION.ONE_HOUR;
const PLAYERS_CACHE_EXPIRE_MS = CACHE_DURATION.ONE_WEEK;
interface GenericCache<T> {
  timestamp: number;
  data: T;
}

// キャッシュ取得用関数
export const getGenericCache = <T>(key: string, expiry: number): T | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const parsed = JSON.parse(cached) as GenericCache<T>;
    return Date.now() - parsed.timestamp < expiry ? parsed.data : null;
  } catch {
    return null;
  }
}
// キャッシュ更新用関数
export const setGenericCache = <T>(key: string, data: T): void => {
  const cache: GenericCache<T> = {
    timestamp: Date.now(),
    data
  };
  localStorage.setItem(key, JSON.stringify(cache));
}

// 記事データのキャッシュ管理
export const getCachedArticles = (): CachedArticles | null => {
  return getGenericCache<CachedArticles>(CACHE_KEY_NEWS, NEWS_CACHE_EXPIRE_MS);
}
export const setCachedArticles = (articles: Article[]): void => {
  const cache: CachedArticles = {
    timestamp: Date.now(),
    data: articles
  };
  setGenericCache(CACHE_KEY_NEWS, cache);
}
// 選手データのキャッシュ管理
export const getCachedPlayers = (): Player[] | null => {
  return getGenericCache<Player[]>(CACHE_KEY_PLAYERS, PLAYERS_CACHE_EXPIRE_MS);
}
export const setCachedPlayers = (players: Player[]): void => {
  setGenericCache(CACHE_KEY_PLAYERS, players);
}
// キャッシュクリア
export const clearCache = (type: 'news' | 'players' = 'news'): void => {
  localStorage.removeItem(
    type === 'news' ? CACHE_KEY_NEWS : CACHE_KEY_PLAYERS
  );
};
