import express from "express";
import asyncHandler from "express-async-handler";
import * as adminController from "../controllers/admin/adminController";
import { roleMiddleware } from "../middleware/roleMiddleware";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// Middleware для проверки прав администратора
const adminPermissions = roleMiddleware({
  requiredPermissions: ["MANAGE_ADMINS"],
});

// 1. Получение текущего администратора
router.get(
  "/current",
  authMiddleware, // Проверка аутентификации
  adminPermissions, // Проверка прав доступа
  asyncHandler(adminController.getCurrentAdmin)
);

// 2. Обновление текущего администратора
router.put(
  "/current",
  authMiddleware,
  adminPermissions,
  asyncHandler(adminController.updateCurrentAdmin)
);

// 3. Получение всех администраторов
router.get(
  "/",
  authMiddleware,
  adminPermissions,
  asyncHandler(adminController.getAllAdmins)
);

// 4. Получение логов действий администратора
router.get(
  "/logs",
  authMiddleware,
  adminPermissions,
  asyncHandler(adminController.getAdminLogs)
);

// 5. Активация/деактивация администратора
router.put(
  "/:id/status",
  authMiddleware,
  adminPermissions,
  asyncHandler(adminController.toggleAdminStatus)
);

export default router;
