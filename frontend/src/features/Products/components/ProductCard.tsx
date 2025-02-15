import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFavorite } from "@/features/Products/hooks/useFavorite";
import { useCart } from "@/features/Buyer/hooks/useCart";

interface ProductCardProps {
  id: string;
  sellerId: string;
  image?: string;
  name: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, sellerId, image, name, price }) => {
  const { isFavorite, toggleFavorite, isAnimating } = useFavorite();
  const { addItemToCart, isItemInCart } = useCart();

  const placeholderImage = "https://placehold.co/220x180?text=No+Image";

  const handleAddToCart = () => {
    if (!id || !sellerId || !price) {
      console.error("Ошибка: ID товара, ID продавца или цена отсутствует.");
      return;
    }
    addItemToCart(id, sellerId, price, 1); 
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 220.66,
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={image || placeholderImage}
        alt={name}
        sx={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          borderRadius: "8px",
        }}
      />

      <IconButton
        onClick={() => toggleFavorite()}
        disableRipple
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: isFavorite ? "#d32f2f" : "#B0B0B0",
          animation: isFavorite && isAnimating ? "heartbeat 0.3s ease-in-out" : "none",
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        {isFavorite ? <FavoriteIcon sx={{ fontSize: 24 }} /> : <FavoriteBorderOutlinedIcon sx={{ fontSize: 24 }} />}
      </IconButton>

      <Box sx={{ padding: "8px", textAlign: "left" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "#333",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "100%",
          }}
          title={name}
        >
          {name}
        </Typography>

        <Typography variant="h6" sx={{ color: "#d32f2f", fontWeight: "bold", marginTop: "4px" }}>
          {price}₽
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          sx={{ marginTop: "8px", textTransform: "none" }}
          disabled={isItemInCart(id)}
        >
          {isItemInCart(id) ? "В корзине" : "Добавить в корзину"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProductCard;
