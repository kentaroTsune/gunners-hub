import type { Article } from '../../../types/article';
import { useFavorite } from '../../../hooks/useFavorite';

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
  const { isFavorite, isProcessing, toggleFavorite } = useFavorite(article);

  const buttonClasses = [
    sizeClasses[size],
    'transition-colors',
    isFavorite
      ? 'text-[#FF69B4] hover:text-[#FF8FAB]'
      : 'text-gray-300 hover:text-[#FF8FAB]',
    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
  ].join(' ');

  const ariaLabel = isFavorite ? 'お気に入りから削除' : 'お気に入りに追加';

  return (
    <button
      onClick={toggleFavorite}
      disabled={isProcessing}
      aria-label={ariaLabel}
      className={buttonClasses}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
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
