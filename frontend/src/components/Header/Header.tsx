import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import Logo from "./components/Logo";
import CategoryMenu from "./components/CategoryMenu";
import SearchBar from "./components/SearchBar";
import OrdersIcon from "./components/Icons/OrdersIcon";
import FavoritesIcon from "./components/Icons/FavoritesIcon";
import CartIcon from "./components/Icons/CartIcon";
import ProfileIcon from "./components/Icons/ProfileIcon";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  const icons = [
    { icon: <OrdersIcon />, label: "Заказы" },
    { icon: <FavoritesIcon />, label: "Избранное" },
    { icon: <CartIcon />, label: "Корзина" },
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "white",
        boxShadow: "none",
        borderBottom: "1px solid #ddd",
        width: "100%",
        zIndex: 1100,
        minHeight: "64px",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <Logo />

        <Box sx={{ display: "flex", alignItems: "center", flex: 1, justifyContent: "center", gap: 2 }}>
          <CategoryMenu />
          <SearchBar />
        </Box>

        <Box display="flex" alignItems="center" gap={3}>
          {icons.map(({ icon, label }, index) => (
            <Box key={index} display="flex" flexDirection="column" alignItems="center">
              {icon}
              <Typography variant="caption" sx={{ color: "#888", fontSize: "12px" }}>
                {label}
              </Typography>
            </Box>
          ))}

          {isAuthenticated ? (
            <ProfileIcon />
          ) : (
            <Button
  variant="contained"
  onClick={() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }}
  sx={{
    backgroundColor: "#007BFF",
    color: "#fff",
    textTransform: "none",
    "&:hover": { backgroundColor: "#0056b3" },
  }}
>
  Войти
</Button>

          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
