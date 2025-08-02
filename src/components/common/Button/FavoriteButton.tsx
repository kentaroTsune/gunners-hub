import { useState, useEffect } from 'react';
import type { Article } from '../../../types/article';
import { useAuthStore } from '../../../stores/authStore';
import { createFavorite, deleteFavorite, findFavoriteByUserAndArticle } from '../../../repositories/favoriteRepository';
import { useNewsContext } from '../../../context/NewsContext';

interface FavoriteButtonProps {
  article: Article;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
} as const;

export const FavoriteButton = ({ article, size = 'md' }: FavoriteButtonProps) => {
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
        console.error(`お気に入り状態確認エラー ${currentUser.uid}/${article.article_id}: ${String(error)}`);
        setIsFavorite(false);
      }
    };

    checkFavoriteStatus();
  }, [currentUser?.uid, article?.article_id]);

  const handleClick = async () => {
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    if (!article?.article_id || isProcessing) return;

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
      throw new Error(`お気に入り操作エラー ${currentUser.uid}/${article.article_id}: ${String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
      className={`${sizeClasses[size]} transition-colors ${
        isFavorite
          ? 'text-[#FF69B4] hover:text-[#FF8FAB]'
          : 'text-gray-300 hover:text-[#FF8FAB]'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
};
