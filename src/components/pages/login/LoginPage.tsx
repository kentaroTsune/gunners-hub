import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../../firebase';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>
        <button
          onClick={handleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
        >
          Googleでログイン
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
