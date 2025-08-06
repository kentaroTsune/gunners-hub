import { QueryClient } from '@tanstack/react-query';
import { CACHE_DURATION } from '../constants/cache';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // デフォルトキャッシュ設定
      staleTime: CACHE_DURATION.ONE_HOUR,
      gcTime: CACHE_DURATION.ONE_DAY,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});