import { Link } from 'react-router-dom';
import type { Article } from '../../../types/article';
import { FavoriteButton } from '../../common/Button/FavoriteButton';
import { useMemo } from 'react';
import { IMAGE_PATHS } from '../../../constants/ui';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const safeImageUrl = useMemo(() => {
    if (!article.image_url) return IMAGE_PATHS.DUMMY_IMAGE;

    try {
      const url = new URL(article.image_url);
      return url.protocol === 'https:' ? article.image_url : IMAGE_PATHS.DUMMY_IMAGE;
    } catch {
      return IMAGE_PATHS.DUMMY_IMAGE;
    }
  }, [article.image_url]);

  const formattedDate = useMemo(() => {
    return new Date(article.pubDate).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }, [article.pubDate]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src === IMAGE_PATHS.DUMMY_IMAGE) {
      img.src = IMAGE_PATHS.DUMMY_IMAGE;
    }
  };

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <figure>
        <img
          src={safeImageUrl}
          alt={article.translatedTitle || article.title}
          className="w-full md:h-50 object-cover"
          loading="lazy"
          onError={handleImageError}
        />
      </figure>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500">
            {article.source_name} • {formattedDate}
          </span>
          <FavoriteButton article={article} size="sm" />
        </div>
        <h3 className="text-lg font-bold mb-2">
          {article.translatedTitle || article.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {article.description || article.content}
        </p>
        <Link
          to={`/article/detail/${article.article_id}`}
          className="text-red-600 hover:underline font-medium"
          aria-label={`記事「${article.translatedTitle || article.title}」の詳細を読む`}
        >
          続きを読む
        </Link>
      </div>
    </article>
  );
};
