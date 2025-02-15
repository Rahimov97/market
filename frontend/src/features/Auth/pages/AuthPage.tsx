import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setError(null); 
  }, [isLogin]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = isLogin
    ? formData.phone.trim() !== "" && formData.password.trim() !== ""
    : formData.firstName.trim() !== "" && formData.phone.trim() !== "" && formData.password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return; 

    setLoading(true);
    setError(null);
    try {
      await authenticate(isLogin, formData);
      navigate("/"); 
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
          minWidth: "340px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          color: "#000",
          position: "relative",
        }}
      >
        <BackButton />
        <Box sx={{ height: "20px" }} />
        
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <AuthToggle isLogin={isLogin} onToggle={setIsLogin} />
        </Box>

        <AuthForm
          isLogin={isLogin}
          phone={formData.phone}
          password={formData.password}
          name={formData.firstName}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
        />

        {error && (
          <Typography variant="body2" sx={{ color: "red", mt: 1, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AuthPage;
