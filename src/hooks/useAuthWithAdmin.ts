import { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import type { User, UseAuthReturn } from '../types/auth';
import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuthWithAdmin = (): UseAuthReturn => {
  const { currentUser, loading: authLoading } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        return;
      }

      setAdminLoading(true);
      try {
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
        setIsAdmin(adminDoc.exists());
      } catch (error) {
        setIsAdmin(false);
        throw new Error(`管理者権限確認エラー ${currentUser.uid}: ${String(error)}`);
      } finally {
        setAdminLoading(false);
      }
    }

    checkAdminStatus();
  }, [currentUser]);

  const user: User | null = currentUser ? {
    uid: currentUser.uid,
    email: currentUser.email,
    displayName: currentUser.displayName
  } : null;

  return {
    user,
    isAdmin,
    loading: authLoading || adminLoading
  };
}