import React, { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const categories = ["Одежда и обувь", "Дом", "Детские товары", "Электроника", "Бытовая техника"];

const CategoryMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Кнопка Каталог */}
      <Button
        variant="contained"
        onClick={toggleMenu}
        sx={{
          bgcolor: "#FFD700",
          color: "black",
          textTransform: "none",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "8px 16px",
          "&:hover": { bgcolor: "#FFC107" },
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {/* Анимация три полоски в X */}
        <Box
          sx={{
            display: "inline-block",
            position: "relative",
            width: "18px",
            height: "14px",
            transition: "transform 0.3s ease",
          }}
        >
          {/* Верхняя линия */}
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "2px",
              bgcolor: "black",
              borderRadius: "1px",
              top: 0,
              transform: isMenuOpen ? "translateY(6px) rotate(45deg)" : "translateY(0) rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
          {/* Средняя линия */}
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "2px",
              bgcolor: "black",
              borderRadius: "1px",
              top: "6px",
              opacity: isMenuOpen ? 0 : 1,
              transition: "opacity 0.3s ease",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: "100%",
              height: "2px",
              bgcolor: "black",
              borderRadius: "1px",
              bottom: 0,
              transform: isMenuOpen ? "translateY(-6px) rotate(-45deg)" : "translateY(0) rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </Box>
        Каталог
      </Button>

      <Collapse
        in={isMenuOpen}
        timeout="auto"
        sx={{
          position: "absolute",
          top: "100%",
          left: 0,
          zIndex: 10,
          bgcolor: "white",
          width: 300,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          mt: 1,
        }}
      >
        <List>
          {categories.map((category, index) => (
            <ListItem
              key={index}
              component="li" 
              sx={{
                cursor: "pointer",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                },
              }}
            >
              <ListItemText primary={category} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default CategoryMenu;
