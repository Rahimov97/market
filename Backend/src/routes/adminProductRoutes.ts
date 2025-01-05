import express from "express";
import asyncHandler from "express-async-handler";
import * as productController from "../controllers/admin/productManagementController";
import {
  validateCreateProduct,
  validateUpdateProduct,
  handleValidationErrors,
} from "../validations/productManagementValidation";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

// Middleware для проверки прав администратора
const adminPermissions = roleMiddleware({
  requiredPermissions: ["MANAGE_PRODUCTS"],
});

// 1. Создать продукт
router.post(
  "/",
  adminPermissions,
  validateCreateProduct,
  handleValidationErrors, // Отдельно обработка ошибок
  asyncHandler(productController.createProduct)
);

// 2. Получить список продуктов
router.get(
  "/",
  adminPermissions,
  asyncHandler(productController.getProducts)
);

// 3. Получить продукт по ID
router.get(
  "/:id",
  adminPermissions,
  asyncHandler(productController.getProductById)
);

// 4. Обновить продукт
router.put(
  "/:id",
  adminPermissions,
  validateUpdateProduct,
  handleValidationErrors, // Отдельно обработка ошибок
  asyncHandler(productController.updateProduct)
);

// 5. Удалить продукт или предложение
router.delete(
  "/:id",
  adminPermissions,
  asyncHandler(productController.deleteProduct)
);

export default router;
