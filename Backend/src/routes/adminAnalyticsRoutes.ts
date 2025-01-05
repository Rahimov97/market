import express from "express";
import * as analyticsController from "../controllers/admin/analyticsController";
import { roleMiddleware } from "../middleware/roleMiddleware";

const router = express.Router();

// Middleware для проверки прав администратора
const adminPermissions = roleMiddleware({
  requiredPermissions: ["VIEW_ANALYTICS"],
});

// 1. Получение аналитики пользователей
router.get("/users", adminPermissions, analyticsController.getUserAnalytics);

// 2. Получение аналитики продуктов
router.get("/products", adminPermissions, analyticsController.getProductAnalytics);

// 3. Получение аналитики заказов
router.get("/orders", adminPermissions, analyticsController.getOrderAnalytics);

// 4. Получение аналитики продавцов
router.get("/sellers", adminPermissions, analyticsController.getSellerAnalytics);

// 5. Получение общей аналитики
router.get("/overall", adminPermissions, analyticsController.getOverallAnalytics);

export default router;
