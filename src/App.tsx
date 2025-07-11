import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/header/Header';
import ArticleDetail from './components/main/ArticleDetail.tsx';
import LoginPage from './components/auth/LoginPage';
import './App.css';
import { NewsProvider } from './context/NewsContext';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/footer/Footer';
import { PlayerList } from './components/player/PlayerList';
import { PlayerDetail } from './components/player/PlayerDetail';
import HomePage from './components/main/HomePage.tsx';

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header hideActions={location.pathname !== '/'} />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/players" element={<PlayerList />} />
          <Route path="/players/:id" element={<PlayerDetail />} />
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
        <AppContent />
      </NewsProvider>
    </AuthProvider>
  );
}

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;