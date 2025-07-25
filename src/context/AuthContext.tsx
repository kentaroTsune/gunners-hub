import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';

type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
      setCurrentUser(user);
      setLoading(false);
      },
      (error) => {
        console.error(`認証状態監視エラー: ${String(error)}`);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuthはAuthProvider内で使用してください');
  return context;
};
