import React from "react";
import { Box, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "@/features/Buyer/hooks/useCart";

const CartPage: React.FC = () => {
  const { cart, updateItemQuantity, removeItemFromCart, loading, error } = useCart();

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (!productId) {
      console.error("Product ID is undefined! Cannot change quantity.");
      return;
    }
    console.log("Updating quantity for:", productId, "to:", quantity);
    updateItemQuantity(productId, quantity);
  };
  
  const handleRemove = (productId: string) => {
    console.log("handleRemove:", { productId });
    if (!productId) {
      console.error("Product ID is undefined! Cannot remove item.");
      return;
    }
    removeItemFromCart(productId);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Shopping Cart
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : cart.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <Box>
          {cart.map((item) => (
            <Box
              key={item.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              p={2}
              border="1px solid #ddd"
              borderRadius={2}
            >
              <Typography variant="body1">{item.name}</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </Button>
                <Typography>{item.quantity}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  +
                </Button>
                <IconButton onClick={() => handleRemove(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Proceed to Checkout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CartPage;
