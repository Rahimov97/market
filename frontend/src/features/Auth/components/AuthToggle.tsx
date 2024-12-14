import React from "react";
import { Box, Button } from "@mui/material";

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: (isLogin: boolean) => void;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, onToggle }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "25px", // Закругленные края
        backgroundColor: "#001F3F", // Темно-синий фон
        padding: "4px", // Отступ для кнопок внутри переключателя
        marginBottom: "16px",
        width: "100%", // Растягиваем переключатель по ширине
      }}
    >
      <Button
        onClick={() => onToggle(true)}
        sx={{
          flex: 1,
          backgroundColor: isLogin ? "#002A5C" : "transparent", // Активный фон для кнопки
          color: isLogin ? "#FFF" : "#888", // Цвет текста активной/неактивной кнопки
          borderRadius: "20px", // Закругленные края кнопки
          fontWeight: "bold",
          textTransform: "none", // Текст с первой заглавной
          height: "40px", // Высота кнопки
          "&:hover": {
            backgroundColor: isLogin ? "#003A78" : "transparent", // При наведении
          },
        }}
      >
        Вход
      </Button>
      <Button
        onClick={() => onToggle(false)}
        sx={{
          flex: 1,
          backgroundColor: !isLogin ? "#002A5C" : "transparent", // Активный фон для кнопки
          color: !isLogin ? "#FFF" : "#888", // Цвет текста активной/неактивной кнопки
          borderRadius: "20px", // Закругленные края кнопки
          fontWeight: "bold",
          textTransform: "none", // Текст с первой заглавной
          height: "40px", // Высота кнопки
          "&:hover": {
            backgroundColor: !isLogin ? "#003A78" : "transparent", // При наведении
          },
        }}
      >
        Регистрация
      </Button>
    </Box>
  );
};

export default AuthToggle;
