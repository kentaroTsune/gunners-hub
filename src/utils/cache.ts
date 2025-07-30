import type { Article, CachedArticles } from '../types/article';
import type { Player } from '../types/player';
import { CACHE_KEYS, CACHE_EXPIRY, CACHE_TYPES } from '../constants/cache';

interface GenericCache<T> {
  timestamp: number;
  data: T;
}

// キャッシュ取得用関数
const getGenericCache = <T>(key: string, expiry: number): T | null => {
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
const setGenericCache = <T>(key: string, data: T): void => {
  const cache: GenericCache<T> = {
    timestamp: Date.now(),
    data
  };
  localStorage.setItem(key, JSON.stringify(cache));
}

// 記事データのキャッシュ管理
export const getCachedArticles = (): CachedArticles | null => {
  return getGenericCache<CachedArticles>(CACHE_KEYS.NEWS, CACHE_EXPIRY.NEWS);
}

export const setCachedArticles = (articles: Article[]): void => {
  const cache: CachedArticles = {
    timestamp: Date.now(),
    data: articles
  };
  setGenericCache(CACHE_KEYS.NEWS, cache);
}

// 選手データのキャッシュ管理
export const getCachedPlayers = (): Player[] | null => {
  return getGenericCache<Player[]>(CACHE_KEYS.PLAYERS, CACHE_EXPIRY.PLAYERS);
}

export const setCachedPlayers = (players: Player[]): void => {
  setGenericCache(CACHE_KEYS.PLAYERS, players);
}

// キャッシュクリア
export const clearCache = (type: 'news' | 'players' = CACHE_TYPES.NEWS): void => {
  localStorage.removeItem(
    type === CACHE_TYPES.NEWS ? CACHE_KEYS.NEWS : CACHE_KEYS.PLAYERS
  );
};