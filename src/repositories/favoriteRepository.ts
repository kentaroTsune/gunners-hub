import { collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import type { Article } from '../types/article';

const FAVORITES_COLLECTION = 'favorites';

export interface FavoriteDocument {
  userId: string;
  articleId: string;
  addedAt: Date;
  articleData: Article;
}

export const createFavorite = async (userId: string, article: Article): Promise<void> => {
  try {
    await addDoc(collection(db, FAVORITES_COLLECTION), {
      userId,
      articleId: article.article_id,
      addedAt: new Date(),
      articleData: article
    });
  } catch (error) {
    throw new Error(`お気に入り作成エラー ${userId}/${article.article_id}: ${String(error)}`);
  }
};

export const deleteFavorite = async (userId: string, articleId: string): Promise<void> => {
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
    throw new Error(`お気に入り削除エラー ${userId}/${articleId}: ${String(error)}`);
  }
};

export const findFavoritesByUser = async (userId: string): Promise<FavoriteDocument[]> => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        userId: data.userId,
        articleId: data.articleId,
        addedAt: data.addedAt.toDate(),
        articleData: data.articleData
      };
    });
  } catch (error) {
    throw new Error(`お気に入り取得エラー ${userId}: ${String(error)}`);
  }
};

export const findFavoriteByUserAndArticle = async (userId: string, articleId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('articleId', '==', articleId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    throw new Error(`お気に入り確認エラー ${userId}/${articleId}: ${String(error)}`);
  }
};