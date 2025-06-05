import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Article } from '../types/article';
import { fetchNews } from '../api/fetchNews';
import { getFavorites } from '../services/favorites';
import { useAuth } from '../context/AuthContext';

interface NewsContextType {
  articles: Article[];
  favorites: string[];
  setArticles: (articles: Article[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  updateFavorites: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType>({
  articles: [],
  favorites: [],
  setArticles: () => {},
  searchQuery: '',
  setSearchQuery: () => {},
  selectedCategory: 'all',
  setSelectedCategory: () => {},
  updateFavorites: async () => {},
});

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const updateFavorites = async () => {
    if (!currentUser) {
      // ログアウト状態ではお気に入りを空にする
      setFavorites([]);
      setArticles(prevArticles =>
        prevArticles.map(article => ({
          ...article,
          isFavorite: false
        }))
      );
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
      console.error('Failed to update favorites:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNews();
        setArticles(data);

        // ログイン状態ならお気に入りを取得
        if (currentUser) {
          await updateFavorites();
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
        setArticles([]);
      }
    };
    fetchData();
  }, [currentUser]);

  // ログイン状態が変わった時に状態を更新
  useEffect(() => {
    if (!currentUser) {
      // ログアウト時にお気に入りをクリア
      setFavorites([]);
      setArticles(prevArticles =>
        prevArticles.map(article => ({
          ...article,
          isFavorite: false
        }))
      );
    }
  }, [currentUser]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery === '' ||
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.content && article.content.toLowerCase().includes(searchQuery.toLowerCase()));

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
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};