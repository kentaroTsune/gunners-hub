import { db } from '../firebase';
import { collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import type { Article } from '../types/article';

const FAVORITES_COLLECTION = 'favorites';

export interface FavoriteArticle {
  userId: string;
  articleId: string;
  addedAt: Date;
  articleData: Article;
}

export const addFavorite = async (userId: string, article: Article): Promise<void> => {
  try {
    await addDoc(collection(db, FAVORITES_COLLECTION), {
      userId,
      articleId: article.article_id,
      addedAt: new Date(),
      articleData: article
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (userId: string, articleId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('articleId', '==', articleId)
    );
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

export const getFavorites = async (userId: string): Promise<FavoriteArticle[]> => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const favorites = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        userId: data.userId,
        articleId: data.articleId,
        addedAt: data.addedAt.toDate(),
        articleData: data.articleData
      };
    });
    return favorites;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const checkIsFavorite = async (userId: string, articleId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('articleId', '==', articleId)
    );

    const snapshot = await getDocs(q);
    const isFavorite = !snapshot.empty;

    return isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    throw error;
  }
};
