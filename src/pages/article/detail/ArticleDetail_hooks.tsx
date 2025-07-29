import { useParams } from 'react-router-dom';
import { useNewsContext } from '../../../context/NewsContext';
import { useMemo } from 'react';
import { getSafeImageUrl, formatArticleDate, createImageErrorHandler } from './ArticleDetail_utils';

export const useArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { articles } = useNewsContext();

  const article = useMemo(() => {
    if (!id) return null;
    return articles.find(article => article.article_id === id) || null;
  }, [articles, id]);

  const safeImageUrl = useMemo(() =>
    getSafeImageUrl(article?.image_url),
    [article?.image_url]
  );

  const formattedDate = useMemo(() =>
    formatArticleDate(article?.pubDate),
    [article?.pubDate]
  );

  const handleImageError = useMemo(() =>
    createImageErrorHandler(),
    []
  );

  return {
    article,
    safeImageUrl,
    formattedDate,
    handleImageError
  };
};