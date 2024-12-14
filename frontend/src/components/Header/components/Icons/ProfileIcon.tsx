import React from "react";
import { Box, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ProfileIconProps {
  isAuthenticated: boolean;
  userPhotoUrl?: string; // Ссылка на фото пользователя (если есть)
}

const ProfileIcon: React.FC<ProfileIconProps> = ({
  isAuthenticated,
  userPhotoUrl = "https://via.placeholder.com/40", // Заглушка
}) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile"); // Переход в профиль
    } else {
      navigate("/auth"); // Переход на страницу входа
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={handleProfileClick}
    >
      {isAuthenticated ? (
        <Avatar
          src={userPhotoUrl}
          alt="Profile"
          sx={{
            width: 40,
            height: 40,
            border: "2px solid #ddd",
          }}
        />
      ) : (
        <Button
          variant="text"
          sx={{
            backgroundColor: "#f5f5f5",
            color: "black",
            fontSize: "14px",
            fontWeight: "normal",
            borderRadius: "8px",
            padding: "8px 16px",
            textTransform: "capitalize", 
            "&:hover": { backgroundColor: "#e0e0e0" },
          }}
        >
          Войти
        </Button>
      )}
    </Box>
  );
};

export default ProfileIcon;
