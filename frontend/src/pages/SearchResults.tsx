import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import { Box, Grid, Typography } from '@mui/material';
import ProductCard from '../components/ProductCard';

const SearchResults: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const data = await getProducts(query);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        padding: 4,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Результаты поиска: "{query}"
      </Typography>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
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

export default SearchResults;
