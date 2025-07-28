import { useEffect, useState } from "react";
import { checkUserIsAdmin } from "../repositories/adminRepository";
import { transformFirebaseUserToUser } from "../utils/userTransformer";
import type { UseAuthReturn } from '../types/auth';
import { useAuthContext } from '../context/AuthContext';

export const useAuthWithAdmin = (): UseAuthReturn => {
  const { currentUser, loading: authLoading } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminLoading, setAdminLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setAdminLoading(false);
        return;
      }

      setAdminLoading(true);
      try {
        const adminStatus = await checkUserIsAdmin(currentUser.uid);
        setIsAdmin(adminStatus);
      } catch (error) {
        setIsAdmin(false);
        console.error(error);
      } finally {
        setAdminLoading(false);
      }
    }

    checkAdminStatus();
  }, [currentUser]);

  const user = transformFirebaseUserToUser(currentUser);

  return {
    user,
    isAdmin,
    loading: authLoading || adminLoading
  };
};