import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController';
import { authMiddleware, checkRole, CustomRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Регистрация
router.post('/register', registerUser);

// Авторизация
router.post('/login', loginUser);

// Профиль пользователя
router.get('/profile', authMiddleware, getProfile);

// Пример защищенного маршрута
router.get('/admin', authMiddleware, checkRole(['admin']), (req: CustomRequest, res) => {
  res.json({ message: `Welcome, admin! User ID: ${req.user?.id}` });
});

export default router;
