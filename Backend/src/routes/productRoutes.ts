import express from "express";
import {
  createProduct,
  updateProduct,
  getProductById,
  getProducts,
  deleteProduct,
  updateProductOffer,
  deleteProductOffer,
  getProductForSeller,
} from "../controllers/products/productController";
import {
  validateProductCreation,
  validateProductUpdate,
  validateGetProductById,
  validateUpdateOffer,
  validateDeleteOffer,
} from "../validations/productValidation";
import authMiddleware, { roleMiddleware } from "../middleware/authMiddleware";
import validationMiddleware from "../middleware/validationMiddleware";

const router = express.Router();

// Middleware для продавцов
const sellerAuthMiddleware = [authMiddleware, roleMiddleware("seller")];

// CRUD маршруты для продуктов
router.post(
  "/",
  ...sellerAuthMiddleware,
  validateProductCreation,
  validationMiddleware,
  createProduct // Создание нового продукта
);

router.put(
  "/:id",
  ...sellerAuthMiddleware,
  validateProductUpdate,
  validationMiddleware,
  updateProduct // Обновление информации о продукте
);

router.put(
  "/:id/offer",
  ...sellerAuthMiddleware,
  validateUpdateOffer, // Валидация обновления предложения
  validationMiddleware,
  updateProductOffer // Обновление предложения продавца
);

router.delete(
  "/:id/offer", // Специфичный маршрут
  ...sellerAuthMiddleware,
  validateDeleteOffer,
  validationMiddleware,
  deleteProductOffer
);

router.delete(
  "/:id", // Общий маршрут
  ...sellerAuthMiddleware,
  roleMiddleware(["admin", "manager"]),
  validateGetProductById,
  validationMiddleware,
  deleteProduct
);

router.get(
  "/:id/seller",
  ...sellerAuthMiddleware,
  validateGetProductById, // Валидация получения продукта по ID
  validationMiddleware,
  getProductForSeller // Получение продукта с учетом данных продавца
);

router.get("/:id", validateGetProductById, validationMiddleware, getProductById); // Получение продукта по ID
router.get("/", getProducts); // Получение списка продуктов

export default router;
