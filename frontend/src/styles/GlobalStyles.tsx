import React, { ReactNode } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

// Создаём тему Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Основной цвет
    },
    secondary: {
      main: '#d32f2f', // Вторичный цвет
    },
    background: {
      default: '#ffffff', // Глобальный фон
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff', // Устанавливаем белый фон для body
          margin: 0,
          padding: 0,
          minHeight: '100vh', // Гарантируем, что страница занимает весь экран
          display: 'flex',
          flexDirection: 'column',
        },
        '#root': {
          minHeight: '100vh', // Убедитесь, что root занимает всю высоту экрана
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
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
