import React from "react";
import { Badge, IconButton } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { useCart } from "@/features/Buyer/hooks/useCart";
import { useNavigate } from "react-router-dom";

const CartIcon: React.FC = () => {
  const { cart, loading } = useCart();
  const navigate = useNavigate();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <IconButton onClick={() => navigate("/cart")}>
      <Badge badgeContent={!loading ? itemCount : 0} color="primary">
        <LocalMallOutlinedIcon sx={{ fontSize: 24, color: "black" }} />
      </Badge>
    </IconButton>
  );
};

export default CartIcon;
