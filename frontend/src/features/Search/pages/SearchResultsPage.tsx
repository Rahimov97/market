import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "@/features/Products/components/ProductCard";

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  const searchTerm = searchParams.get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/products?search=${encodeURIComponent(
            searchTerm || ""
          )}`
        );
        setProducts(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) fetchSearchResults();
  }, [searchTerm]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!products.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">No products found</Typography>
      </Box>
    );
  }

  return (
    <Box padding={4}>
      <Typography variant="h5" gutterBottom>
        Поиск по "{searchTerm}"
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <ProductCard
              name={product.name}
              sellerId={product.offers[0]?.seller || ""}
              price={product.offers[0]?.price || 0}
              image={product.image}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchResultsPage;
