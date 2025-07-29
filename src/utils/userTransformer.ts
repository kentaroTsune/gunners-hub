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