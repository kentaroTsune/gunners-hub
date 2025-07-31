import { QueryClient } from '@tanstack/react-query';
import { CACHE_DURATION } from '../constants/cache';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // デフォルトキャッシュ設定
      staleTime: CACHE_DURATION.ONE_HOUR, // 1時間は新鮮とみなす
      gcTime: CACHE_DURATION.ONE_DAY, // 1日後にガベージコレクション
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