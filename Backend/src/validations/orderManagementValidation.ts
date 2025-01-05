import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Валидация создания заказа
export const validateCreateOrder = [
  check("user")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'user' обязательно.")
    .isMongoId()
    .withMessage("Поле 'user' должно содержать валидный ID пользователя."),

  check("items")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'items' обязательно.")
    .isArray({ min: 1 })
    .withMessage("Поле 'items' должно быть массивом с минимум одним элементом.")
    .custom((items) => {
      return Array.isArray(items) && items.every((item: any) => {
        return (
          item.product &&
          typeof item.product === "string" &&
          item.seller &&
          typeof item.seller === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0 &&
          typeof item.priceAtPurchase === "number" &&
          item.priceAtPurchase >= 0 &&
          (!item.discountApplied || typeof item.discountApplied === "number")
        );
      });
    })
    .withMessage(
      "Каждый элемент 'items' должен содержать поля 'product' (строка), 'seller' (строка), 'quantity' (положительное число), 'priceAtPurchase' (неотрицательное число), и необязательное 'discountApplied' (число)."
    ),

  check("shippingDetails")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'shippingDetails' обязательно.")
    .isObject()
    .withMessage("Поле 'shippingDetails' должно быть объектом.")
    .custom((details) => {
      return (
        details &&
        details.address &&
        typeof details.address === "string" &&
        details.city &&
        typeof details.city === "string" &&
        details.country &&
        typeof details.country === "string" &&
        details.postalCode &&
        typeof details.postalCode === "string" &&
        details.shippingCost &&
        typeof details.shippingCost === "number" &&
        details.shippingCost >= 0 &&
        (!details.trackingNumber || typeof details.trackingNumber === "string")
      );
    })
    .withMessage(
      "Поле 'shippingDetails' должно содержать 'address' (строка), 'city' (строка), 'country' (строка), 'postalCode' (строка), 'shippingCost' (неотрицательное число) и необязательное 'trackingNumber' (строка)."
    ),

  check("paymentDetails")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'paymentDetails' обязательно.")
    .isObject()
    .withMessage("Поле 'paymentDetails' должно быть объектом.")
    .custom((details) => {
      return (
        details &&
        details.method &&
        ["card", "paypal", "cash_on_delivery"].includes(details.method) &&
        typeof details.amountPaid === "number" &&
        details.amountPaid >= 0 &&
        (!details.transactionId || typeof details.transactionId === "string")
      );
    })
    .withMessage(
      "Поле 'paymentDetails' должно содержать 'method' (один из 'card', 'paypal', 'cash_on_delivery'), 'amountPaid' (неотрицательное число) и необязательное 'transactionId' (строка)."
    ),

  // Завершающая проверка ошибок
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Ошибка валидации данных",
        errors: errors.array(),
      });
    }
    next();
  },
];

// Валидация обновления статуса заказа
export const validateUpdateOrderStatus = [
  check("status")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'status' обязательно.")
    .isString()
    .withMessage("Поле 'status' должно быть строкой.")
    .isIn(["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"])
    .withMessage(
      "Поле 'status' должно быть одним из: 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'."
    ),

  // Завершающая проверка ошибок
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Ошибка валидации данных",
        errors: errors.array(),
      });
    }
    next();
  },
];
