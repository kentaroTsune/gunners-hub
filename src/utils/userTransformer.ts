import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '../types/auth';

// Firebase Userをアプリ内User型に変換
export const transformFirebaseUserToUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName
  };
};

// Userの基本情報バリデーション
export const validateUser = (user: User | null): boolean => {
  return !!(user?.uid && user?.email);
};

// Userの表示名取得（フォールバック付き）
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'ゲスト';

  return user.displayName || user.email || 'ユーザー';
};