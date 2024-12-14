import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFavorite } from "@/features/Products/hooks/useFavorite";

interface ProductCardProps {
  image?: string;
  name: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, name, price }) => {
  const { isFavorite, toggleFavorite, isAnimating } = useFavorite();

  const placeholderImage = "https://via.placeholder.com/220x180?text=No+Image";

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
      {/* Картинка товара */}
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

      {/* Иконка "Избранное" */}
      <IconButton
        onClick={toggleFavorite}
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

      {/* Информация о товаре */}
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
          {name.length > 50 ? `${name.slice(0, 50)}...` : name}
        </Typography>
        <Typography variant="h6" sx={{ color: "#d32f2f", fontWeight: "bold", marginTop: "4px" }}>
          {price}₽
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductCard;
