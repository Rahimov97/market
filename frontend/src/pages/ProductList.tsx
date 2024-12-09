import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';
import ProductUploader from './ProductUploader';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box sx={{ padding: 4, width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Заголовок */}
      <Typography variant="h4" sx={{ marginBottom: 4, textAlign: 'center' }}>
        Product List
      </Typography>

      {/* Иконка загрузки продукта */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
        <ProductUploader />
      </Box>

      {/* Карточки продуктов */}
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <ProductCard
              name={product.name}
              price={product.offers[0]?.price || 0}
              image={product.image} // Отображение загруженной картинки
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
