import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { queryClient } from './lib/queryClient';
import { Header } from './components/layout/Header/Header.tsx';
import { Footer } from './components/layout/Footer/Footer.tsx';
import { ArticleDetail } from './pages/article/detail/ArticleDetail.tsx';
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/login/LoginPage';
import { PlayerList } from './pages/player/PlayerList';
import { PlayerDetail } from './pages/player/detail/PlayerDetail';
import { NewsProvider } from './context/NewsContext';
import { AuthIitializer } from './stores/authStore';
import './App.css';

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header hideActions={location.pathname !== '/'} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/article/detail/:id" element={<ArticleDetail />} />
          <Route path="/player" element={<PlayerList />} />
          <Route path="/player/detail/:id" element={<PlayerDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthIitializer>
        <NewsProvider>
          <Router>
            <AppContent />
          </Router>
        </NewsProvider>
      </AuthIitializer>

      {/* 開発環境でのみDevtools表示 */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;