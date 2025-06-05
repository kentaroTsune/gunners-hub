import { useNewsContext } from '../../context/NewsContext';
import { useAuth } from '../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Link } from 'react-router-dom';

const Header = ({ hideActions = false }) => {
  const { currentUser } = useAuth();
  const { setSearchQuery, setSelectedCategory, selectedCategory } = useNewsContext();

  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/arsenal.png"
              alt="Arsenal FC"
              className="h-10 w-auto object-contain"
              aria-label="Arsenal FC Logo"
            />
            <h1 className="text-xl font-bold">The Gunners Hub</h1>
          </a>
        </div>
        {!hideActions && (
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory(selectedCategory === 'favorites' ? 'all' : 'favorites')}
                className={`px-3 py-2 rounded transition-colors ${
                  selectedCategory === 'favorites'
                    ? 'bg-red-700 text-white hover:bg-red-800'
                    : 'bg-white text-gray-800 hover:bg-gray-100'
                }`}
                aria-label={selectedCategory === 'favorites' ? 'すべての記事を表示' : 'お気に入り記事を表示'}
              >
                {selectedCategory === 'favorites' ? 'すべて表示' : 'お気に入り'}
              </button>
            </div>

            <input
              type="text"
              placeholder="記事を検索"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white px-3 py-2 rounded text-gray-800"
              aria-label="記事を検索"
            />
            <div className="flex items-center">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => signOut(auth)}
                    className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    ログアウト
                  </button>
                  <img 
                    src={currentUser.photoURL || '/arsenal.png'} 
                    alt="User" 
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors ml-2"
                >
                  ログイン
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
