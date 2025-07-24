import { useNewsContext } from '../../../context/NewsContext';
import ArticleCard from '../../common/Card/ArticleCard';

const ArticleList = () => {
  const { articles, searchQuery } = useNewsContext();

  return (
    <div className="space-y-6 py-8">
      <h2 className="text-3xl font-bold text-gray-800">最新記事</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.length === 0 ? (
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

export default ArticleList;
