import express from "express";
import { registerBuyer } from "../controllers/Auth/userRegisterController";
import { loginBuyer } from "../controllers/Auth/userLoginController";
import { getProfile } from "../controllers/Auth/userAuthController";
import {
  updateProfileController,
  updateAvatarController,
  addAddressController,
  removeAddressController,
} from "../controllers/profile/profileController";
import authMiddleware from "../middleware/authMiddleware";
import validationMiddleware from "../middleware/validationMiddleware";
import {
  registerValidation,
  loginValidation,
} from "../validations/authValidation";
import {
  updateProfileValidation,
  updateAvatarValidation,
} from "../validations/userValidation";

const router = express.Router();

// --- Регистрация ---
router.post(
  "/register",
  registerValidation, // Валидация данных для регистрации
  validationMiddleware, // Обработка ошибок валидации
  registerBuyer
);

// --- Вход ---
router.post(
  "/login",
  loginValidation, // Валидация данных для входа
  validationMiddleware, // Обработка ошибок валидации
  loginBuyer
);

// --- Профиль ---
// Получение профиля
router.get("/profile", authMiddleware, getProfile);

// Обновление профиля
router.put(
  "/profile",
  authMiddleware, // Проверка авторизации
  updateProfileValidation, // Валидация данных профиля
  validationMiddleware, // Обработка ошибок валидации
  updateProfileController
);

// Обновление аватара
router.put(
  "/profile/avatar",
  authMiddleware, // Проверка авторизации
  updateAvatarValidation, // Валидация URL аватара
  validationMiddleware, // Обработка ошибок валидации
  updateAvatarController
);

// --- Адреса ---
// Добавление адреса
router.post(
  "/profile/address",
  authMiddleware, // Проверка авторизации
  validationMiddleware, // Обработка ошибок валидации
  addAddressController
);

// Удаление адреса
router.delete(
  "/profile/address/:index",
  authMiddleware, // Проверка авторизации
  removeAddressController
);

export default router;
