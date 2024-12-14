import React from "react";
import { Box, Typography } from "@mui/material";

interface ProductDetailsInfoProps {
  name: string;
  description: string;
  category: string;
  offers: number;
}

const ProductDetailsInfo: React.FC<ProductDetailsInfoProps> = ({
  name,
  description,
  category,
  offers,
}) => {
  return (
    <Box padding={4}>
      <Typography variant="h4">{name}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Typography variant="subtitle1">Category: {category}</Typography>
      <Typography variant="subtitle2">Offers: {offers}</Typography>
    </Box>
  );
};

export default ProductDetailsInfo;
