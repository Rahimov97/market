import express from "express";
import * as userController from "../controllers/admin/userManagementController";
import {
  validateCreateUser,
  validateUpdateUser,
  handleValidationErrors,
} from "../validations/userManagementValidation";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

// Middleware для проверки прав администратора
const adminPermissions = roleMiddleware({
  requiredPermissions: ["MANAGE_USERS"],
});

// 1. Создать пользователя
router.post(
  "/",
  adminPermissions,
  validateCreateUser,
  handleValidationErrors,
  userController.createUser
);

// 2. Получить список пользователей
router.get("/", adminPermissions, userController.getUsers);

// 3. Получить пользователя по ID
router.get("/:id", adminPermissions, userController.getUserById);

// 4. Обновить пользователя
router.put(
  "/:id",
  adminPermissions,
  validateUpdateUser,
  handleValidationErrors,
  userController.updateUser
);

// 5. Удалить пользователя
router.delete("/:id", adminPermissions, userController.deleteUser);

// 6. Добавить продукт в избранное
router.post(
  "/:id/favorites",
  adminPermissions,
  userController.addToFavorites
);

// 7. Удалить продукт из избранного
router.delete(
  "/:id/favorites",
  adminPermissions,
  userController.removeFromFavorites
);

// 8. Обновить адрес пользователя
router.put(
  "/:id/addresses",
  adminPermissions,
  userController.updateAddress
);

export default router;
