import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

import {
  InventoryOutlined as InventoryOutlinedIcon,
  ShoppingBagOutlined as ShoppingBagOutlinedIcon,
  KeyboardReturnOutlined as KeyboardReturnOutlinedIcon,
  FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
  CommentOutlined as CommentOutlinedIcon,
  LocalOfferOutlined as LocalOfferOutlinedIcon,
  CompareOutlined as CompareOutlinedIcon,
  BusinessCenterOutlined as BusinessCenterOutlinedIcon,
  StoreMallDirectoryOutlined as StoreMallDirectoryOutlinedIcon,
  SupportAgentOutlined as SupportAgentOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  HelpOutlineOutlined as HelpOutlineOutlinedIcon,
  LogoutOutlined as LogoutOutlinedIcon
} from "@mui/icons-material";

const DEFAULT_AVATAR_URL = "https://placehold.co/40";

const USER_MENU_ITEMS = [
  { icon: <InventoryOutlinedIcon />, label: "Заказы" },
  { icon: <ShoppingBagOutlinedIcon />, label: "Купленные товары" },
  { icon: <KeyboardReturnOutlinedIcon />, label: "Возвраты" },
  { icon: <FavoriteBorderOutlinedIcon />, label: "Избранное" },
  { icon: <CommentOutlinedIcon />, label: "Мои отзывы и вопросы" },
  { icon: <LocalOfferOutlinedIcon />, label: "Промокоды" },
  { icon: <CompareOutlinedIcon />, label: "Сравнение" },
];

const EXTRA_MENU_ITEMS = [
  {
    icon: <BusinessCenterOutlinedIcon />,
    label: "Покупайте как юрлицо",
  },
  {
    icon: <StoreMallDirectoryOutlinedIcon />,
    label: "Продавайте на Маркете",
  },
  {
    icon: <SupportAgentOutlinedIcon />,
    label: "Чат с поддержкой",
  },
];

const ProfileIcon: React.FC = () => {
  const { isAuthenticated, logout, user, fetchUserProfile } = useAuthContext();
  const [avatarPreview, setAvatarPreview] = useState<string>(DEFAULT_AVATAR_URL);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return; 
    if (!user) {
      fetchUserProfile();
    } else {
      setAvatarPreview(user.avatar ? `http://localhost:5000${user.avatar}` : DEFAULT_AVATAR_URL);
    }
  }, [isAuthenticated, user, fetchUserProfile]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = useCallback(() => setAnchorEl(null), []);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
      handleMenuClose();
    },
    [navigate, handleMenuClose]
  );

  const handleLogout = useCallback(() => {
    logout();
    handleMenuClose();
  }, [logout, handleMenuClose]);

  if (!isAuthenticated) {
    return (
      <Box
        onClick={() => navigate("/auth")}
        sx={{
          backgroundColor: "#f5f5f5",
          color: "black",
          fontSize: "14px",
          fontWeight: "normal",
          borderRadius: "8px",
          padding: "8px 16px",
          textTransform: "capitalize",
          "&:hover": { backgroundColor: "#e0e0e0" },
          cursor: "pointer",
        }}
      >
        Войти
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
      <Avatar
        src={avatarPreview}
        alt={user?.firstName || "Profile"}
        onClick={handleMenuOpen}
        sx={{
          width: 40,
          height: 40,
          border: "2px solid #ddd",
          transition: "transform 0.2s",
          "&:hover": { transform: "scale(1.1)" },
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ style: { maxWidth: 300 } }}
      >
        <Box
          sx={{
            padding: "16px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => handleNavigate("/profile")}
        >
          <Avatar src={avatarPreview} alt="User" sx={{ width: 50, height: 50 }} />
          <Box sx={{ marginLeft: "12px" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user?.firstName || "Имя пользователя"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || "user@email.com"}
            </Typography>
          </Box>
        </Box>
        <Divider />

        {USER_MENU_ITEMS.map((item, index) => (
          <MenuItem key={index}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}

        <Divider />

        {EXTRA_MENU_ITEMS.map((item, index) => (
          <MenuItem key={`extra-${index}`}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}

        <MenuItem onClick={() => handleNavigate("/profile")}>
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Настройки" />
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <HelpOutlineOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Справка" />
        </MenuItem>
        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutOutlinedIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Выйти" />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileIcon;
