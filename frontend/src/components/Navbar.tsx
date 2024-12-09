import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      console.log(`Ищем: ${searchTerm}`);
      // Реализация поиска, если требуется
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'white',
        boxShadow: 'none',
        borderBottom: '1px solid #ddd',
        width: '100%',
        padding: '8px 0',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px',
        }}
      >
        {/* Логотип */}
        <Box display="flex" alignItems="center" gap={2}>
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            style={{
              borderRadius: '50%',
              width: 40,
              height: 40,
            }}
          />
        </Box>

        {/* Поисковая строка и Каталог */}
        <Box
          display="flex"
          alignItems="center"
          sx={{
            flex: 1,
            maxWidth: 800,
            marginLeft: 4,
          }}
        >
          {/* Кнопка "Каталог" */}
          <Button
            variant="contained"
            sx={{
              bgcolor: '#FFD700',
              color: 'black',
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '8px 16px',
              marginRight: '16px', // Расстояние от поисковой строки
              '&:hover': {
                bgcolor: '#FFC107',
              },
            }}
            startIcon={<MenuIcon sx={{ color: 'black' }} />}
          >
            Каталог
          </Button>

          {/* Поисковая строка */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              border: '2px solid #FFD700',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <TextField
              placeholder="Найти товары"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm.trim()) handleSearch();
              }}
              InputProps={{
                sx: {
                  border: 'none',
                  backgroundColor: 'white',
                  '&:hover fieldset': { borderColor: 'transparent' },
                  '&.Mui-focused fieldset': { borderColor: 'transparent' },
                },
              }}
              sx={{
                flex: 1,
                border: 'none',
                '& .MuiOutlinedInput-root': {
                  border: 'none',
                  backgroundColor: 'transparent',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                if (searchTerm.trim()) handleSearch();
              }}
              sx={{
                bgcolor: '#FFD700',
                color: 'black',
                textTransform: 'none',
                fontWeight: 'bold',
                padding: '8px 16px',
                borderRadius: 0,
                '&:hover': {
                  bgcolor: '#FFC107',
                },
              }}
            >
              Найти
            </Button>
          </Box>
        </Box>

        {/* Иконки Заказы, Избранное, Корзина */}
        <Box display="flex" alignItems="center" gap={3} ml={2}>
          {/* Заказы */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <IconButton>
              <Inventory2OutlinedIcon sx={{ fontSize: 24, color: 'black' }} />
            </IconButton>
            <Typography
              variant="caption"
              sx={{ color: '#888', fontWeight: 'normal', fontSize: '12px' }}
            >
              Заказы
            </Typography>
          </Box>

          {/* Избранное */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <IconButton>
              <FavoriteBorderOutlinedIcon
                sx={{ fontSize: 24, color: 'black' }}
              />
            </IconButton>
            <Typography
              variant="caption"
              sx={{ color: '#888', fontWeight: 'normal', fontSize: '12px' }}
            >
              Избранное
            </Typography>
          </Box>

          {/* Корзина */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <IconButton>
              <ShoppingCartOutlinedIcon sx={{ fontSize: 24, color: 'black' }} />
            </IconButton>
            <Typography
              variant="caption"
              sx={{ color: '#888', fontWeight: 'normal', fontSize: '12px' }}
            >
              Корзина
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
