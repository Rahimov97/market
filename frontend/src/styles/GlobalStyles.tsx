import React, { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Основной цвет
    },
    secondary: {
      main: "#d32f2f", // Вторичный цвет
    },
    background: {
      default: "#ffffff", // Глобальный фон
    },
    text: {
      primary: "#000000", // Черный цвет текста
      secondary: "#6c757d", // Серый цвет текста
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    allVariants: {
      color: "#000000", // Глобальный цвет текста
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // Убираем серый эффект
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease-in-out", // Добавляем эффект
          "&:active": {
            transform: "scale(0.95)", // Эффект "ухода внутрь" при нажатии
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "transform 0.2s ease-in-out", // Добавляем эффект
          "&:active": {
            transform: "scale(0.95)", // Эффект "ухода внутрь" при нажатии
          },
          "&:hover": {
            backgroundColor: "transparent", // Убираем эффект при наведении
          },
        },
      },
    },
  },
});

const GlobalStyles: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default GlobalStyles;
