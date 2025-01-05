import express from "express";
import {
    getSellerAnalytics,
    getProductSalesAnalytics,
    getRevenueByPeriod,
    getPopularProducts,
    getWarehouseAnalytics,
  } from "../controllers/sellers/analyticsController";
import authMiddleware from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Продавец должен быть авторизован
router.use(authMiddleware);
router.use(roleMiddleware("seller"));

// Получить общую аналитику продавца
router.get("/", getSellerAnalytics);

// Получить аналитику продаж по продуктам
router.get("/products", getProductSalesAnalytics);

// Получить доход за период
router.get("/revenue", getRevenueByPeriod);

// Получить популярные товары
router.get("/popular-products", getPopularProducts);

// Получить аналитику по складам
router.get("/warehouses", getWarehouseAnalytics);

export default router;
