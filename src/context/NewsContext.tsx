import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Article } from '../types/article';
import { findFavoritesByUser } from '../repositories/favoriteRepository';
import { useAuthContext } from '../stores/authStore';
import { useNewsQuery } from '../hooks/queries/useNewsQuery';

interface NewsContextType {
  articles: Article[];
  favorites: string[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  updateFavorites: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuthContext();

  // TanStack Queryでニュース取得
  const { data: newsData, isLoading: newsLoading, error: newsError } = useNewsQuery();
  // UI状態管理（検索・フィルター）
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // ニュースデータの加工（お気に入り状態付与）
  const articlesWithFavorites = useMemo(() => {
    if (!newsData) return [];

    return newsData.map(article => ({
      ...article,
      isFavorite: favorites.includes(article.article_id)
    }));
  }, [newsData, favorites]);

  const clearFavoriteStatus = () => {
    setFavorites([]);
  }

  const updateFavorites = async () => {
    if (!currentUser) {
      clearFavoriteStatus();
      return;
    }

    try {
      const userFavorites = await findFavoritesByUser(currentUser.uid);
      const favoriteIds = userFavorites.map(fav => fav.articleId);
      setFavorites(favoriteIds);
    } catch (error) {
      console.error(`お気に入り更新エラー ${currentUser.uid}: ${String(error)}`);
    } finally {
      setFavoritesLoading(false);
    }
  };

  // お気に入り情報の初期取得・更新
  useEffect(() => {
    if (currentUser) {
      updateFavorites();
    } else {
      clearFavoriteStatus();
    }
  }, [currentUser]);

  // ログアウト時のクリア
  useEffect(() => {
    if (!currentUser) {
      clearFavoriteStatus();
    }
  }, [currentUser]);

  // フィルタリング処理
  const filteredArticles = useMemo(() => {
    if (!articlesWithFavorites.length) return [];

    return articlesWithFavorites.filter(article => {
      const matchesSearch = searchQuery === '' ||
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFavorite = selectedCategory === 'favorites'
        ? favorites.includes(article.article_id)
        : true;

      return matchesSearch && matchesFavorite;
    });
  }, [articlesWithFavorites, searchQuery, selectedCategory, favorites]);

  // ローディング状態の統合
  const loading = newsLoading || favoritesLoading;

  // エラーハンドリング（ニュース取得エラー時）
  useEffect(() => {
    if (newsError) {
      console.error(`ニュース取得エラー: ${String(newsError)}`);
    }
  }, [newsError]);

  return (
    <NewsContext.Provider
      value={{
        articles: filteredArticles,
        favorites,
        loading,
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