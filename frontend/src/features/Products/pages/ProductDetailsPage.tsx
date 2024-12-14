import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useProduct } from "@/features/Products/hooks/useProduct";

const ProductDetailsPage: React.FC = () => {
  const { product, loading, error } = useProduct();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
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
      <Typography variant="subtitle1">Category: {product.category}</Typography>
      <Typography variant="subtitle2">Offers: {product.offers.length}</Typography>
    </Box>
  );
};

export default ProductDetailsPage;
