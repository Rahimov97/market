import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import AuthForm from "../components/AuthForm";
import AuthToggle from "../components/AuthToggle";
import BackButton from "../components/BackButton";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ firstName: "", phone: "", password: "" });
  const { authenticate } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    setLoading(true);
    setError(null);
    try {
      await authenticate(isLogin, formData);
      navigate("/"); // Перенаправляем после успешной авторизации
    } catch (err: any) {
      setError(err.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#001F3F",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "32px",
          width: "320px",
          color: "#000",
          position: "relative",
        }}
      >
        <BackButton />
        <Box sx={{ height: "30px" }} />
        <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />
        <AuthForm
          isLogin={isLogin}
          phone={formData.phone}
          password={formData.password}
          name={formData.firstName}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />
        {error && (
          <Typography
            variant="body2"
            sx={{ color: "red", marginTop: "8px", textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AuthPage;
