import { body, param } from "express-validator";

// Общие валидационные правила
const commonValidationRules = {
  name: body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Название товара должно содержать не менее 3 символов."),
  description: body("description")
    .optional()
    .isString()
    .withMessage("Описание должно быть строкой."),
  category: body("category")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("Категория обязательна и должна быть строкой."),
  price: body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Цена должна быть положительным числом."),
  stock: body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Количество должно быть целым неотрицательным числом."),
  attributes: body("attributes")
    .optional()
    .isObject()
    .withMessage("Атрибуты должны быть объектом."),
  image: body("image")
    .optional()
    .isString()
    .isURL()
    .withMessage("URL изображения должен быть валидным."),
  sellerId: body("sellerId")
    .optional()
    .isMongoId()
    .withMessage("ID продавца должен быть валидным MongoDB ID."),
};

// Валидация создания продукта
export const validateProductCreation = [
  commonValidationRules.name.notEmpty().withMessage("Название товара обязательно."),
  commonValidationRules.description,
  commonValidationRules.category.notEmpty().withMessage("Категория обязательна."),
  commonValidationRules.price.notEmpty().withMessage("Цена обязательна и должна быть больше 0."),
  commonValidationRules.stock.notEmpty().withMessage("Количество обязательно и должно быть неотрицательным числом."),
  commonValidationRules.sellerId.notEmpty().withMessage("ID продавца обязателен."),
  commonValidationRules.attributes,
  commonValidationRules.image,
];

// Валидация обновления продукта
export const validateProductUpdate = [
  param("id").isMongoId().withMessage("Некорректный ID товара."),
  commonValidationRules.name,
  commonValidationRules.description,
  commonValidationRules.category,
  commonValidationRules.price,
  commonValidationRules.stock,
  commonValidationRules.attributes,
  commonValidationRules.image,
];

// Валидация удаления продукта
export const validateDeleteProduct = [
  param("id").isMongoId().withMessage("Некорректный ID товара."),
];

// Валидация получения продукта по ID
export const validateGetProductById = [
  param("id").isMongoId().withMessage("Некорректный ID товара."),
];

// Валидация обновления предложения продавца
export const validateUpdateOffer = [
  param("id").isMongoId().withMessage("Некорректный ID товара."),
  commonValidationRules.price,
  commonValidationRules.stock,
  commonValidationRules.description,
  commonValidationRules.image,
];

// Валидация удаления предложения продавца
export const validateDeleteOffer = [
  param("id").isMongoId().withMessage("Некорректный ID товара."),
];