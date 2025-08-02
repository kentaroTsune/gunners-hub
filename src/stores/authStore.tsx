import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import type { User } from 'firebase/auth';
import { useEffect } from 'react';
import { transformFirebaseUserToUser } from '../utils/userTransformer';

interface AuthState {
  currentUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  adminLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setAdminLoading: (adminLoading: boolean) => void;
  initialize: () => () => void;
  checkAdminStatus: (uid: string) => Promise<void>;
}

const initialState = {
  currentUser: null,
  loading: true,
  isAdmin: false,
  adminLoading: false,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setCurrentUser: (currentUser) =>
        set({ currentUser }, false, 'setCurrentUser'),
      setLoading: (loading) =>
        set({ loading }, false, 'setLoading'),
      setIsAdmin: (isAdmin) =>
        set({ isAdmin }, false, 'setIsAdmin'),
      setAdminLoading: (adminLoading) =>
        set({ adminLoading }, false, 'setAdminLoading'),

      checkAdminStatus: async (uid: string) => {
        const { checkUserIsAdmin } = await import('../repositories/adminRepository');

        set({ adminLoading: true }, false, 'checkAdminStart');
        try {
          const adminStatus = await checkUserIsAdmin(uid);

          set({ isAdmin: adminStatus, adminLoading: false }, false, 'checkAdminSuccess');
        } catch (error) {
          console.error('Admin状態チェックエラー:', error);
          set({ isAdmin: false, adminLoading: false }, false, 'checkAdminError');
        }
      },

      initialize: () => {
        const unsubscribe = onAuthStateChanged(
          auth,
          async (user) => {
            set({ currentUser: user, loading: false }, false, 'authStateChanged');

            if (user) {
              const state = get();
              await state.checkAdminStatus(user.uid);
            } else {
              set({ isAdmin: false, adminLoading: false }, false, 'resetAdminState');
            }
          },
          (error) => {
            console.error(`認証状態監視エラー: ${String(error)}`);
            set({ loading: false }, false, 'authError');
          }
        );

        return unsubscribe;
      },
    }),
    { name: 'auth-store' }
  )
);

// useAuthWithAdmin の新実装
export const useAuthWithAdmin = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const loading = useAuthStore((state) => state.loading);
  const adminLoading = useAuthStore((state) => state.adminLoading);
  const user = transformFirebaseUserToUser(currentUser);

  return {
    user,
    isAdmin,
    loading: loading || adminLoading,
  };
}

// AuthInitializer コンポーネント
export const AuthIitializer = ({ children }: { children: React.ReactNode }) => {
  const { loading, initialize } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initialize();

    return unsubscribe;
  }, [initialize]);

  return <>{!loading && children}</>;
};