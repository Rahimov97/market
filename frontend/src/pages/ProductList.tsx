import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';

interface ProductListProps {
  products: any[];
}

const ProductList: React.FC<ProductListProps> = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <Box
        sx={{
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
        }}
      >
        <Typography variant="h6" sx={{ color: '#888' }}>
          Товары не найдены
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
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
