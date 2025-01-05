import express from "express";
import {
  registerSeller,
  loginSeller,
  checkSellerAuth,
} from "../controllers/sellers/sellerAuthController";
import {
  getSellers,
  getSellerById,
  updateSeller,
  deleteSeller,
} from "../controllers/sellers/sellerController";
import { getSellerAnalytics } from "../controllers/sellers/analyticsController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Регистрация и логин
router.post("/register", registerSeller); // Регистрация продавца
router.post("/login", loginSeller); // Логин продавца
router.get("/auth-check", authMiddleware, checkSellerAuth); // Проверка авторизации

router.get("/", getSellers); // Получить всех продавцов
router.get("/:id", getSellerById); // Получить продавца по ID
router.put("/:id", authMiddleware, updateSeller); // Обновить данные продавца
router.delete("/:id", authMiddleware, deleteSeller); // Удалить продавца
router.get("/:id/analytics", authMiddleware, getSellerAnalytics); // Получить аналитику продавца

export default router;
