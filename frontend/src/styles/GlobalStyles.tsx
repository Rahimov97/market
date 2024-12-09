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
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
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
