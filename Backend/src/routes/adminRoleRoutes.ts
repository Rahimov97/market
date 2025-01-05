import express from "express";
import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controllers/admin/roleController";
import { validateCreateRole, validateUpdateRole, handleValidationErrors } from "../validations/roleValidation";
import { roleMiddleware } from "../middleware/roleMiddleware";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Получение списка ролей
router.get(
  "/",
  authMiddleware, // Проверка аутентификации
  roleMiddleware({ allowedRoles: ["admin", "manager"] }), // Проверка прав доступа
  getRoles
);

// Получение роли по ID
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware({ allowedRoles: ["admin", "manager"] }), // Проверка прав доступа
  getRoleById
);

// Создание новой роли
router.post(
  "/",
  authMiddleware,
  roleMiddleware({ allowedRoles: ["admin"] }), // Только администраторы могут создавать роли
  validateCreateRole, // Валидация входных данных
  handleValidationErrors, // Обработка ошибок валидации
  createRole
);

// Обновление роли
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware({ allowedRoles: ["admin"] }), // Только администраторы могут обновлять роли
  validateUpdateRole, // Валидация входных данных
  handleValidationErrors, // Обработка ошибок валидации
  updateRole
);

// Удаление роли
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware({ allowedRoles: ["admin"] }), // Только администраторы могут удалять роли
  deleteRole
);

export default router;