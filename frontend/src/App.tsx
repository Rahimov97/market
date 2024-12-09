import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BannerCarousel from './components/BannerCarousel';
import ProductList from './pages/ProductList';
import { getProducts } from './services/api';

const App: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (query: string) => {
    if (query) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <BannerCarousel />
      <ProductList products={filteredProducts} />
    </>
  );
};

export default App;
