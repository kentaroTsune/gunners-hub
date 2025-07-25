import { useNewsContext } from '../../context/NewsContext';
import { ArticleCard } from '../../components/common/Card/ArticleCard';

export const ArticleList = () => {
  const { articles, searchQuery, loading } = useNewsContext();

  return (
    <div className="space-y-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800">最新記事</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="flex items-center justify-center gap-4">
              <div className="animate-spin h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
              <p className="text-gray-600">最新記事を読み込み中...</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="col-span-full text-center py-8">
            {searchQuery ?
              `"${searchQuery}"に一致する記事が見つかりませんでした` :
              '記事がありません'
            }
          </div>
        ) : (
          articles.map((article) => (
            <ArticleCard key={article.article_id} article={article} />
          ))
        )}
      </div>
    </div>
  );
};

