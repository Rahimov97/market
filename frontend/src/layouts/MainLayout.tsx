import React from "react";
import { Box } from "@mui/material";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ mt: "34px" }}> {/* Отступ сверху для Header */}
        <Header />
      </Box>
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%", // Ширина на весь экран
          margin: "0 auto",
          padding: "16px",
        }}
      >
        {children}
      </Box>
      <Box sx={{ mt: "3px" }}> {/* Отступ сверху для Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;
