import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from '../components/Product/ProductCard';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(); // Вызываем без параметров
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff', // Глобальный белый фон
        minHeight: '100vh', // Занимает всю высоту экрана
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        padding: 4,
      }}
    >

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
            <ProductCard
              name={product.name}
              price={product.offers[0]?.price || 0}
              image={product.image}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
