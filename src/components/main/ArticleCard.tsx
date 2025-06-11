import { Link } from 'react-router-dom';
import type { Article } from '../../types/article';
import FavoriteButton from '../common/FavoriteButton';

type Props = { article: Article };

const ArticleCard = ({ article }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={(() => {
          try {
            if (!article.image_url) return '/src/assets/img/dummy.jpg';
            const url = new URL(article.image_url);
            return url.protocol === 'https:' ? article.image_url : '/src/assets/img/dummy.jpg';
          } catch {
            return '/src/assets/img/dummy.jpg';
          }
        })()}
        alt={article.translatedTitle || article.title}
        className="w-full md:h-50 object-cover"
        loading="lazy"
        onError={(e) => {
          const img = e.currentTarget;
          img.src = '/src/assets/img/dummy.jpg';
          img.onerror = null;
        }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-gray-500">
            {article.source_name} • {new Date(article.pubDate).toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })}
          </span>
          <FavoriteButton
            article={article}
            size="sm"
          />
        </div>
        <h3 className="text-lg font-bold mb-2">{article.translatedTitle || article.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {article.description || article.content}
        </p>
        <Link
          to={`/article/${article.article_id}`}
          className="text-red-600 hover:underline font-medium"
        >
          続きを読む
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
