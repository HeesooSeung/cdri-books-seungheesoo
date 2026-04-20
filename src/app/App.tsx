import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from '@/widgets/header/Header';
import { SearchPage } from '@/pages/search/SearchPage';
import { FavoritesPage } from '@/pages/favorites/FavoritesPage';

// 루트 레이아웃 + 라우트.
export const App = () => (
  <div className="flex min-h-screen flex-col bg-white">
    <Header />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Navigate to="/search" replace />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="*" element={<Navigate to="/search" replace />} />
      </Routes>
    </main>
  </div>
);
