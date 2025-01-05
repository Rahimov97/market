import express from "express";
import asyncHandler from "express-async-handler";
import * as orderController from "../controllers/admin/orderManagementController";
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
} from "../validations/orderManagementValidation";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

// Middleware для проверки прав администратора
const adminPermissions = roleMiddleware({
  requiredPermissions: ["MANAGE_ORDERS"],
});

// Вспомогательная функция для объединения middleware
const combineValidation = (validations: any[]) => validations.flat();

// 1. Создать заказ
router.post(
  "/",
  adminPermissions,
  ...combineValidation(validateCreateOrder), // Объединяем валидацию
  asyncHandler(orderController.createOrder)
);

// 2. Получить список заказов
router.get(
  "/",
  adminPermissions,
  asyncHandler(orderController.getOrders)
);

// 3. Получить заказ по ID
router.get(
  "/:id",
  adminPermissions,
  asyncHandler(orderController.getOrderById)
);

// 4. Обновить статус заказа
router.put(
  "/:id/status",
  adminPermissions,
  ...combineValidation(validateUpdateOrderStatus), // Объединяем валидацию
  asyncHandler(orderController.updateOrderStatus)
);

// 5. Удалить заказ
router.delete(
  "/:id",
  adminPermissions,
  asyncHandler(orderController.deleteOrder)
);

// 6. Добавить запись в лог статуса заказа
router.post(
  "/:id/status-log",
  adminPermissions,
  ...combineValidation(validateUpdateOrderStatus), // Объединяем валидацию
  asyncHandler(orderController.addOrderStatusLog)
);

export default router;
