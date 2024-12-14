import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import AuthForm from "../components/AuthForm";
import AuthToggle from "../components/AuthToggle";
import BackButton from "../components/BackButton";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "@/layouts/AuthLayout";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", phone: "", password: "" });
  const { loading, error, authenticate } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await authenticate(isLogin, formData);
      window.location.href = "/";
    } catch {}
  };

  return (
    <AuthLayout>
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
            name={formData.name}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />

          {error && <Box sx={{ color: "error.main", marginTop: "8px", textAlign: "center" }}>{error}</Box>}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default AuthPage;
