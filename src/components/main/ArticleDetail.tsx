import { useParams, useNavigate } from 'react-router-dom';
import { useNewsContext } from '../../context/NewsContext';
import FavoriteButton from '../common/FavoriteButton';

const ArticleDetail = () => {
  const { id } = useParams();
  const { articles, favorites, toggleFavorite } = useNewsContext();

  const article = articles.find(article => article.article_id === id);

  if (!article) {
    return <div className="text-center py-8">記事が見つかりません</div>;
  }

  const navigate = useNavigate();

  return (
    <article className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors"
          aria-label="前のページに戻る"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          戻る
        </button>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <FavoriteButton
          isFavorite={favorites.includes(article.article_id)}
          onClick={() => toggleFavorite(article.article_id)}
          size="lg"
        />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-gray-600">{article.source_name}</span>
        <span className="text-gray-500">
          {new Date(article.pubDate).toLocaleDateString()}
        </span>
      </div>

      {article.image_url && (
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
          alt={article.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
          onError={(e) => {
            const img = e.currentTarget;
            img.src = '/src/assets/img/dummy.jpg';
            img.onerror = null;
          }}
        />
      )}

      <p className="text-gray-700 whitespace-pre-line mb-8">
        {article.description}
      </p>

      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-8"
      >
        元の記事を読む
      </a>

    </article>
  );
};

export default ArticleDetail;
