import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header/Header.tsx';
import Footer from './components/layout/Footer/Footer.tsx';
import ArticleDetail from './components/pages/article/ArticleDetail';
import HomePage from './components/pages/home/HomePage';
import LoginPage from './components/pages/login/LoginPage';
import { PlayerList } from './components/pages/player/PlayerList';
import { PlayerDetail } from './components/pages/player/PlayerDetail';
import { NewsProvider } from './context/NewsContext';
import { AuthProvider } from './context/AuthContext';
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
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/player" element={<PlayerList />} />
          <Route path="/player/:id" element={<PlayerDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <NewsProvider>
        <Router>
          <AppContent />
        </Router>
      </NewsProvider>
    </AuthProvider>
  );
};

export default App;