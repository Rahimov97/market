import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BannerCarousel from './components/BannerCarousel';
import ProductList from './pages/ProductList';
import SearchResults from './pages/SearchResults';
import AdminPanel from './pages/AdminPanel';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<>
          <BannerCarousel />
          <ProductList />
        </>} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/admin" element={<AdminPanel />} /> {/* Маршрут для админки */}
      </Routes>
    </Router>
  );
};

export default App;
