import React from "react";
import { Box, Button, TextField } from "@mui/material";

interface AuthFormProps {
  isLogin: boolean;
  phone: string;
  password: string;
  name?: string;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void; // Изменено для принятия события формы
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, phone, password, name, onChange, onSubmit }) => {
  return (
    <Box component="form" onSubmit={onSubmit}>
      {/* Поле ввода имени для регистрации */}
      {!isLogin && (
        <TextField
          placeholder="Имя"
          value={name || ""}
          onChange={(e) => onChange("firstName", e.target.value)}
          fullWidth
          margin="normal"
          InputProps={{
            sx: {
              height: "50px",
              borderRadius: "25px",
              paddingLeft: "16px",
              backgroundColor: "#FFFFFF", // Белый фон для полей ввода
            },
          }}
        />
      )}

      {/* Поле ввода телефона */}
      <TextField
        placeholder="Телефон"
        value={phone}
        onChange={(e) => onChange("phone", e.target.value)}
        fullWidth
        margin="normal"
        autoComplete="tel" // Подсказка браузеру для автозаполнения телефона
        InputProps={{
          sx: {
            height: "50px",
            borderRadius: "25px",
            paddingLeft: "16px",
            backgroundColor: "#FFFFFF", // Белый фон
          },
        }}
      />

      {/* Поле ввода пароля */}
      <TextField
        placeholder="Пароль"
        type="password"
        value={password}
        onChange={(e) => onChange("password", e.target.value)}
        fullWidth
        margin="normal"
        autoComplete="current-password" // Рекомендуемый атрибут
        InputProps={{
          sx: {
            height: "50px",
            borderRadius: "25px",
            paddingLeft: "16px",
            backgroundColor: "#FFFFFF", // Белый фон
          },
        }}
      />

      {/* Кнопка Войти/Зарегистрироваться */}
      <Button
        fullWidth
        type="submit" // Используем "submit" для отправки формы
        sx={{
          height: "50px",
          borderRadius: "25px",
          fontWeight: "bold",
          textTransform: "none", // Текст с первой буквы заглавной
          backgroundColor: "#001F3F", // Темно-синий фон
          color: "#FFF", // Белый текст
          "&:hover": {
            backgroundColor: "#002A5C", // Более темный оттенок синего при наведении
          },
        }}
      >
        {isLogin ? "Войти" : "Зарегистрироваться"}
      </Button>
    </Box>
  );
};

export default AuthForm;
