import { useState, useEffect, useCallback } from 'react';
import type { Article } from '../types/article';
import { useAuthStore } from '../stores/authStore';
import { createFavorite, deleteFavorite, findFavoriteByUserAndArticle } from '../repositories/favoriteRepository';
import { useNewsContext } from '../context/NewsContext';

interface UseFavoriteReturn {
  isFavorite: boolean;
  isProcessing: boolean;
  toggleFavorite: () => Promise<void>;
}

export const useFavorite = (article: Article): UseFavoriteReturn => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { updateFavorites } = useNewsContext();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!currentUser?.uid || !article?.article_id) {
        setIsFavorite(false);
        return;
      }

      try {
        const favoriteStatus = await findFavoriteByUserAndArticle(currentUser.uid, article.article_id);
        setIsFavorite(favoriteStatus);
      } catch (error) {
        console.error(`お気に入り状態確認エラー ${currentUser.uid}/${article.article_id}:`, error);
        setIsFavorite(false);
      }
    };

    checkFavoriteStatus();
  }, [currentUser?.uid, article?.article_id]);

  const toggleFavorite = useCallback(async () => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    if (!article?.article_id || isProcessing) {
      return;
    }

    const newFavoriteStatus = !isFavorite;
    setIsProcessing(true);
    setIsFavorite(newFavoriteStatus);

    try {
      if (newFavoriteStatus) {
        await createFavorite(currentUser.uid, article);
      } else {
        await deleteFavorite(currentUser.uid, article.article_id);
      }

      await updateFavorites();
    } catch (error) {
      setIsFavorite(!newFavoriteStatus);
      console.error(`お気に入り操作エラー ${currentUser.uid}/${article.article_id}:`, error);
    } finally {
      setIsProcessing(false);
    }
  }, [currentUser, article, isFavorite, isProcessing, updateFavorites]);

  return {
    isFavorite,
    isProcessing,
    toggleFavorite,
  };
};
