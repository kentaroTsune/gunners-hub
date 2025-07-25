import { useParams } from 'react-router-dom';
import { useNewsContext } from '../../context/NewsContext';
import { NavigationButton } from '../../components/common/Button/NavigationButton';
import { useMemo } from 'react';

const DUMMY_IMAGE = '/src/assets/img/dummy.jpg';

export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { articles } = useNewsContext();

  const article = useMemo(() => {
    if (!id) return null;
    return articles.find(article => article.article_id === id) || null;
  }, [articles, id]);

  const safeImageUrl = useMemo(() => {
    if (!article?.image_url) return DUMMY_IMAGE;

    try {
      const url = new URL(article.image_url);
      return url.protocol === 'https:' ? article.image_url : DUMMY_IMAGE;
    } catch {
      return DUMMY_IMAGE;
    }
  }, [article?.image_url]);

  const formattedDate = useMemo(() => {
    if (!article?.pubDate) return '';
    return new Date(article.pubDate).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [article?.pubDate]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== DUMMY_IMAGE) {
      img.src = DUMMY_IMAGE;
    }
  };

  if (!article) {
    return (
      <div className="text-center py-8">
        <p>記事が見つかりません</p>
        <NavigationButton text={'戻る'} />
      </div>
    );
  }

  return (
    <article className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <NavigationButton text={'戻る'} />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">
          {article.translatedTitle || article.title}
        </h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-gray-600">{article.source_name}</span>
        <span className="text-gray-500">{formattedDate}</span>
      </div>

      {article.image_url && (
        <figure>
          <img
            src={safeImageUrl}
            alt={article.translatedTitle || article.title}
            className="w-full h-64 object-cover rounded-lg mb-4"
            onError={handleImageError}
          />
        </figure>
      )}

      <p className="text-gray-700 whitespace-pre-line mb-8">
        {article.description || article.content || '記事の内容がありません'}
      </p>

      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mb-8"
        aria-label={`「${article.translatedTitle || article.title}」の元記事を新しいタブで読む`}
      >
        元の記事を読む
      </a>

    </article>
  );
};
