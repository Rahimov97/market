import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categories/categoryController";
import authMiddleware from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

// Получение всех категорий
router.get("/", authMiddleware, getCategories);

// Получение категории по ID
router.get("/:id", authMiddleware, getCategoryById);

// Создание категории (включая возможность создания дочерней категории)
router.post(
  "/",
  authMiddleware,
  roleMiddleware({ allowedRoles: ["admin", "manager"] }), // Передаём объект вместо массива
  createCategory
);

// Обновление категории
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware({ allowedRoles: ["admin", "manager"] }), // Передаём объект вместо массива
  updateCategory
);

// Удаление категории
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware({ allowedRoles: ["admin", "manager"] }), // Передаём объект вместо массива
  deleteCategory
);

export default router;
