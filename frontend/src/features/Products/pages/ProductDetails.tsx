import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from "@/services/api";
import { Box, CircularProgress, Typography } from '@mui/material';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id!);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return <Typography>Product not found</Typography>;
  }

  return (
    <Box padding={4}>
      <Typography variant="h4" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {product.description}
      </Typography>
      <Typography variant="subtitle1">
        Category: {product.category}
      </Typography>
      <Typography variant="subtitle2">
        Offers: {product.offers.length}
      </Typography>
    </Box>
  );
};

export default ProductDetails;
