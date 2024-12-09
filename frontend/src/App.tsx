import React from 'react';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import BannerCarousel from './components/BannerCarousel';
import ProductList from './pages/ProductList';
import SearchResults from './pages/SearchResults';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
      </Routes>
    </Router>
  );
};

export default App;
