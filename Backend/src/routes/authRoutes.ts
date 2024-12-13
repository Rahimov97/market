import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController';
import { authMiddleware, checkRole, CustomRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Регистрация
router.post('/register', async (req: CustomRequest, res) => {
  await registerUser(req, res);
});

// Авторизация
router.post('/login', async (req: CustomRequest, res) => {
  await loginUser(req, res);
});

// Профиль пользователя
router.get('/profile', authMiddleware, async (req: CustomRequest, res) => {
  await getProfile(req, res);
});

// Пример защищенного маршрута
router.get('/admin', authMiddleware, checkRole(['admin']), async (req: CustomRequest, res) => {
  res.json({ message: `Welcome, admin! User ID: ${req.user?.id}` });
});

export default router;
