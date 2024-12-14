import React from "react";
import { Box, Grid } from "@mui/material";
import { useProducts } from "@/features/Products/hooks/useProducts";
import ProductCard from "@/features/Products/components/ProductCard";

const ProductListPage: React.FC = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return <Box>Error loading products</Box>;
  }

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
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

export default ProductListPage;
