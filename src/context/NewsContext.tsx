import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Article } from '../types/article';
import { fetchNews } from '../api/fetchNews';
import { getFavorites } from '../services/favorites';
import { useAuthContext } from '../context/AuthContext';

interface NewsContextType {
  articles: Article[];
  favorites: string[];
  loading: boolean;
  setArticles: (articles: Article[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  updateFavorites: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuthContext();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const clearFavoriteStatus = () => {
    setFavorites([]);
    setArticles(prevArticles =>
      prevArticles.map(article => ({
        ...article,
        isFavorite: false
      }))
    );
  }

  const updateFavorites = async () => {
    if (!currentUser) {
      clearFavoriteStatus();
      return;
    }

    try {
      const userFavorites = await getFavorites(currentUser.uid);
      const favoriteIds = userFavorites.map(fav => fav.articleId);
      setFavorites(favoriteIds);

      setArticles(prevArticles =>
        prevArticles.map(article => ({
          ...article,
          isFavorite: favoriteIds.includes(article.article_id)
        }))
      );
    } catch (error) {
      throw new Error(`お気に入り更新エラー ${currentUser.uid}: ${String(error)}`);
    }
  };

  // データ取得とお気に入り更新
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchNews();
        setArticles(data);

        if (currentUser) {
          await updateFavorites();
        }
      } catch (error) {
        console.error(`ニュース取得エラー: ${String(error)}`);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  // ログアウト時のクリア
  useEffect(() => {
    if (!currentUser) {
      clearFavoriteStatus();
    }
  }, [currentUser]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' ||
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFavorite = selectedCategory === 'favorites'
      ? favorites.includes(article.article_id)
      : true;

    return matchesSearch && matchesFavorite;
  });

  return (
    <NewsContext.Provider
      value={{
        articles: filteredArticles,
        favorites,
        loading,
        setArticles,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        updateFavorites
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNewsContext = (): NewsContextType => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNewsContextはNewsProvider内で使用してください');
  }
  return context;
};