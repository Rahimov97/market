import React from "react";
import { Box, Button, TextField, CircularProgress } from "@mui/material";

interface AuthFormProps {
  isLogin: boolean;
  phone: string;
  password: string;
  name?: string;
  loading: boolean;
  error?: string;
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  phone,
  password,
  name,
  loading,
  error,
  onChange,
  onSubmit,
}) => {
  return (
    <Box component="form" onSubmit={onSubmit}>
      {!isLogin && (
        <TextField
          placeholder="Имя"
          value={name || ""}
          onChange={(e) => onChange("firstName", e.target.value)}
          fullWidth
          margin="normal"
          error={!!error && !name}
          helperText={!!error && !name ? "Имя обязательно" : ""}
          InputProps={{
            sx: {
              height: "50px",
              borderRadius: "25px",
              paddingLeft: "16px",
              backgroundColor: "#FFFFFF",
            },
          }}
        />
      )}

      <TextField
        placeholder="Телефон"
        value={phone}
        onChange={(e) => onChange("phone", e.target.value)}
        fullWidth
        margin="normal"
        autoComplete="tel"
        error={!!error && !phone}
        helperText={!!error && !phone ? "Введите номер телефона" : ""}
        InputProps={{
          sx: {
            height: "50px",
            borderRadius: "25px",
            paddingLeft: "16px",
            backgroundColor: "#FFFFFF",
          },
        }}
      />

      <TextField
        placeholder="Пароль"
        type="password"
        value={password}
        onChange={(e) => onChange("password", e.target.value)}
        fullWidth
        margin="normal"
        autoComplete="current-password"
        error={!!error && !password}
        helperText={!!error && !password ? "Введите пароль" : ""}
        InputProps={{
          sx: {
            height: "50px",
            borderRadius: "25px",
            paddingLeft: "16px",
            backgroundColor: "#FFFFFF",
          },
        }}
      />

      {error && (
        <Box sx={{ color: "red", textAlign: "center", mb: 1, fontSize: "14px" }}>
          {error}
        </Box>
      )}

      <Button
        fullWidth
        type="submit"
        disabled={loading}
        sx={{
          height: "50px",
          borderRadius: "25px",
          fontWeight: "bold",
          textTransform: "none",
          backgroundColor: "#001F3F",
          color: "#FFF",
          "&:hover": {
            backgroundColor: "#002A5C",
          },
        }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : isLogin ? "Войти" : "Зарегистрироваться"}
      </Button>
    </Box>
  );
};

export default AuthForm;
