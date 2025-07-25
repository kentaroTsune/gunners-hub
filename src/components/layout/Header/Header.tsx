import { useNewsContext } from '../../../context/NewsContext';
import { useAuthContext } from '../../../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { Link } from 'react-router-dom';

interface HeaderProps {
  hideActions?: boolean;
}

const CATEGORIES = {
  ALL: 'all',
  FAVORITES: 'favorites',
} as const;

export const Header = ({ hideActions = false }: HeaderProps) => {
  const { currentUser } = useAuthContext();
  const { setSearchQuery, setSelectedCategory, selectedCategory } = useNewsContext();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(`ログアウトエラー: ${String(error)}`);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const toggleCategory = () => {
    const newCategory = selectedCategory === CATEGORIES.FAVORITES
      ? CATEGORIES.ALL
      : CATEGORIES.FAVORITES;
    setSelectedCategory(newCategory);
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== '/arsenal.png') {
      img.src = '/arsenal.png';
    }
  };

  return (
    <header className="bg-red-600 text-white shadow-md">
      <div className="lg:container mx-auto px-4 py-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3 w-[25rem]">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            aria-label="ホームページへ戻る"
          >
            <figure>
              <img
                src="/arsenal.png"
                alt="Arsenal FC ロゴ"
                className="h-10 w-auto object-contain"
                onError={handleImageError}
              />
            </figure>
            <h1 className="text-xl font-bold">The Gunners Hub</h1>
          </Link>
        </div>
        {!hideActions && (
          <div className="flex flex-col-reverse lg:flex-row items-end gap-3 w-full md:w-auto">
            <div className="lg:flex gap-3 hidden md:flex">
              <div className="flex gap-2 w-auto">
                <Link
                  to="/player"
                  className="px-3 py-2 rounded transition-colors bg-white text-gray-800 hover:bg-gray-100"
                >
                  選手一覧
                </Link>
              </div>
              <div className="flex gap-2">
                {currentUser && (
                <button
                  onClick={toggleCategory}
                  className={`px-3 py-2 rounded transition-colors ${
                    selectedCategory === CATEGORIES.FAVORITES
                      ? 'bg-red-700 text-white hover:bg-red-800'
                      : 'bg-white text-gray-800 hover:bg-gray-100'
                  }`}
                  aria-label={selectedCategory === CATEGORIES.FAVORITES ? 'すべての記事を表示' : 'お気に入り記事を表示'}
                >
                  {selectedCategory === CATEGORIES.FAVORITES ? 'すべて表示' : 'お気に入り'}
                </button>
                )}
              </div>
              <input
                type="text"
                placeholder="記事を検索"
                onChange={handleSearchChange}
                className="bg-white px-3 py-2 rounded text-gray-800 md:w-30"
                aria-label="記事を検索"
              />
            </div>
            <div className="flex items-center">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    ログアウト
                  </button>
                  <figure>
                    <img
                      src={currentUser.photoURL || '/arsenal.png'}
                      alt={`${currentUser.displayName || 'ユーザー'}のプロフィール画像`}
                      className="w-8 h-8 rounded-full"
                      onError={handleImageError}
                    />
                  </figure>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-red-600 px-4 py-2 rounded hover:bg-gray-100 transition-colors ml-2"
                  aria-label="ログインページへ"
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
