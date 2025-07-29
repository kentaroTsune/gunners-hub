import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { createLoginErrorMessage, LOGIN_REDIRECT_PATH } from './LoginPage_utils';

export const useLoginPage = () => {
  const { currentUser } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 認証済みユーザーのリダイレクト処理
  useEffect(() => {
    if (currentUser) {
      navigate(LOGIN_REDIRECT_PATH);
    }
  }, [currentUser, navigate]);

  // ログイン処理
  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithPopup(auth, provider);
      navigate(LOGIN_REDIRECT_PATH);
    } catch (loginError) {
      const errorMessage = createLoginErrorMessage(loginError);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // エラーリセット
  const clearError = () => {
    setError(null);
  };

  return {
    currentUser,
    isLoading,
    error,
    handleLogin,
    clearError
  };
};