import React from 'react';
import Navbar from './components/Navbar';
import BannerCarousel from './components/BannerCarousel';
import ProductList from './pages/ProductList';

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <BannerCarousel />
      <ProductList />
    </>
  );
};

export default App;