import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { useProducts } from "@/features/Products/hooks/useProducts";
import ProductCard from "@/features/Products/components/ProductCard";

const ProductListPage: React.FC = () => {
  const { products, loading, error } = useProducts();

  console.info("[ProductListPage] Загружаемые продукты:", products);

  if (loading) {
    return <Box sx={{ textAlign: "center", marginTop: 4 }}>Загрузка...</Box>;
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4, color: "red" }}>
        Ошибка загрузки товаров
      </Box>
    );
  }

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <Box sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h6">Нет доступных товаров</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#ffffff", padding: 4 }}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={product._id}>
            <ProductCard
              id={product._id}
              sellerId={product.offers[0]?.seller || ""}
              name={product.name}
              price={product.offers?.[0]?.price || 0}
              image={product.image}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductListPage;
