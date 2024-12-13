import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // Переключатель между Входом и Регистрацией
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Только для регистрации
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin
        ? 'http://localhost:5000/api/auth/login'
        : 'http://localhost:5000/api/auth/register';

      const payload = isLogin
        ? { phone, password }
        : { name, phone, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации или регистрации');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Не удалось выполнить операцию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#001F3F', // Темно-синий фон
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#fff', // Белая форма
          borderRadius: '12px',
          padding: '24px',
          width: '320px',
          color: '#000',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Стрелка назад */}
        <IconButton
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', top: 8, left: 8, color: '#000' }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>
          {isLogin ? 'Войти' : 'Регистрация'}
        </Typography>

        {/* Переключатели */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <Button
            onClick={() => setIsLogin(true)}
            sx={{
              flex: 1,
              backgroundColor: isLogin ? '#f5f5f5' : 'transparent',
              color: isLogin ? '#000' : '#666',
              borderRadius: '8px 0 0 8px',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Вход
          </Button>
          <Button
            onClick={() => setIsLogin(false)}
            sx={{
              flex: 1,
              backgroundColor: !isLogin ? '#f5f5f5' : 'transparent',
              color: !isLogin ? '#000' : '#666',
              borderRadius: '0 8px 8px 0',
              fontWeight: 'bold',
              textTransform: 'none',
            }}
          >
            Регистрация
          </Button>
        </Box>

        {/* Формы */}
        <Box>
          {!isLogin && (
            <TextField
              label="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          )}
          <TextField
            label="Телефон"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ marginTop: '8px', textAlign: 'left' }}
            >
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            onClick={handleSubmit}
            fullWidth
            sx={{
              marginTop: '16px',
              backgroundColor: '#001F3F', // Цвет аналогичен фону
              color: '#FFF',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#002A5C' },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginRegister;
