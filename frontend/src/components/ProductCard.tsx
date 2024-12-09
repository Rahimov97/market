import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Box } from '@mui/material';

interface ProductCardProps {
  name: string;
  description: string;
  category: string;
  offersCount: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, description, category, offersCount }) => {
  return (
    <Card sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Typography variant="subtitle1" color="primary">
          Category: {category}
        </Typography>
        <Typography variant="subtitle2">
          Offers: {offersCount}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button size="small" variant="contained" color="primary">
            View Details
          </Button>
          <Button size="small" variant="outlined" color="secondary">
            Add to Cart
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
