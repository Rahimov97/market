import React, { useEffect, useState } from "react";
import { getCart, updateCartQuantity, removeFromCart } from "@/services/api/cartApi";
import { Box, Button, CircularProgress, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart();
        console.log("[CartPage] Данные корзины:", data);
        setCart(data.items || []);
      } catch (err: any) {
        setError(err.message || "Ошибка загрузки корзины");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);  

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateCartQuantity(productId, quantity);
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("Ошибка обновления количества:", err);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      setCart((prevCart) => prevCart.filter((item) => item.product._id !== productId));
    } catch (err) {
      console.error("Ошибка удаления товара:", err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>Корзина</Typography>
      {cart.length === 0 ? (
        <Typography>Корзина пуста</Typography>
      ) : (
        cart.map((item) => (
          <Box
            key={item.productId || item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
              borderBottom: "1px solid #ccc",
            }}
          >
            <Typography sx={{ flex: 1 }}>{item.name}</Typography>
            <Typography sx={{ flex: 1, textAlign: "center" }}>
              {item.price ? `${item.price} ₽` : "Цена не указана"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                sx={{ minWidth: 40 }}
                onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
              >
                -
              </Button>
              <Typography component="span" sx={{ mx: 2 }}>{item.quantity}</Typography>
              <Button
                sx={{ minWidth: 40 }}
                onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
              >
                +
              </Button>
            </Box>
            <IconButton onClick={() => handleRemoveItem(item.productId)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))        
      )}
      {cart.length > 0 && (
        <Button variant="contained" color="primary" sx={{ marginTop: 3 }}>
          Оформить заказ
        </Button>
      )}
    </Box>
  );
};

export default CartPage;
