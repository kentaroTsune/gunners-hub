import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '../../api/fetchNews';
import { transformRawArticlesToArticles } from '../../utils/newsTransformer';
import { QUERY_KEYS, STALE_TIME } from '../../constants/queries';
import type { Article } from '../../types/article';

export const useNewsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.NEWS],
    queryFn: async (): Promise<Article[]> => {
      const rawArticles = await fetchNews();
      return await transformRawArticlesToArticles(rawArticles);
    },
    staleTime: STALE_TIME.NEWS,
  });
};