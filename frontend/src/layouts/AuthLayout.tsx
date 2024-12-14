import React from "react";
import { Box } from "@mui/material";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#001F3F", // Фон для всей страницы
      }}
    >
      {children}
    </Box>
  );
};

export default AuthLayout;
