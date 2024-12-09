import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { Box, Grid, CircularProgress } from '@mui/material';
import ProductCard from '../components/ProductCard';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="auto" alignItems="auto" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Grid container spacing={2} justifyContent="auto">
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={2.5} key={product._id}>
            <ProductCard
              name={product.name}
              description={product.description}
              category={product.category}
              offersCount={product.offers.length}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductList;
