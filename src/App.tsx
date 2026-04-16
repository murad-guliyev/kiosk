import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './lib/LangContext';
import { HomePage } from './pages/HomePage/HomePage';
import { MoneyDetailPage } from './pages/MoneyDetailPage/MoneyDetailPage';
import { startImagePreload } from './lib/imagePreloader';

export default function App() {
  useEffect(() => {
    startImagePreload();
  }, []);

  return (
    <BrowserRouter>
      <LangProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/money/:familyId" element={<MoneyDetailPage />} />
        </Routes>
      </LangProvider>
    </BrowserRouter>
  );
}
