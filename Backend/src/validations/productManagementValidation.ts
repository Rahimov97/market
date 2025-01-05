import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Общая обработка ошибок валидации
export const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: "error",
        message: "Ошибка валидации данных",
        errors: errors.array(),
      });
      return; // Прекращаем выполнение, если есть ошибки
    }
    next(); // Переходим к следующему middleware
  };

// Валидация создания продукта
export const validateCreateProduct = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'name' обязательно.")
    .isString()
    .withMessage("Поле 'name' должно быть строкой.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Поле 'name' должно содержать от 3 до 100 символов."),
  check("description")
    .optional()
    .isString()
    .withMessage("Поле 'description' должно быть строкой.")
    .isLength({ max: 500 })
    .withMessage("Поле 'description' не должно превышать 500 символов."),
  check("category")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'category' обязательно.")
    .isString()
    .withMessage("Поле 'category' должно быть строкой."),
  check("image")
    .optional()
    .isURL()
    .withMessage("Поле 'image' должно быть валидным URL."),
  check("offers")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'offers' обязательно.")
    .isArray({ min: 1 })
    .withMessage("Поле 'offers' должно быть массивом с минимум одним элементом.")
    .custom((offers) =>
      offers.every((offer: any) => {
        return (
          offer.seller &&
          typeof offer.seller === "string" &&
          offer.price &&
          typeof offer.price === "number" &&
          offer.stock &&
          typeof offer.stock === "number"
        );
      })
    )
    .withMessage(
      "Каждый элемент 'offers' должен содержать поля 'seller' (строка), 'price' (число) и 'stock' (число)."
    ),
  check("attributes")
    .optional()
    .isObject()
    .withMessage("Поле 'attributes' должно быть объектом."),
  check("discount")
    .optional()
    .isObject()
    .withMessage("Поле 'discount' должно быть объектом.")
    .custom((discount) => {
      if (
        discount &&
        (!Number.isFinite(discount.percentage) ||
          discount.percentage < 0 ||
          discount.percentage > 100)
      ) {
        throw new Error(
          "Поле 'percentage' в 'discount' должно быть числом от 0 до 100."
        );
      }
      if (
        discount &&
        discount.startDate &&
        discount.endDate &&
        new Date(discount.startDate) > new Date(discount.endDate)
      ) {
        throw new Error(
          "Дата начала скидки не может быть позже даты окончания."
        );
      }
      return true;
    }),
];

// Валидация обновления продукта
export const validateUpdateProduct = [
  check("name")
    .optional()
    .isString()
    .withMessage("Поле 'name' должно быть строкой.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Поле 'name' должно содержать от 3 до 100 символов."),
  check("description")
    .optional()
    .isString()
    .withMessage("Поле 'description' должно быть строкой.")
    .isLength({ max: 500 })
    .withMessage("Поле 'description' не должно превышать 500 символов."),
  check("category")
    .optional()
    .isString()
    .withMessage("Поле 'category' должно быть строкой."),
  check("image")
    .optional()
    .isURL()
    .withMessage("Поле 'image' должно быть валидным URL."),
  check("attributes")
    .optional()
    .isObject()
    .withMessage("Поле 'attributes' должно быть объектом."),
  check("discount")
    .optional()
    .isObject()
    .withMessage("Поле 'discount' должно быть объектом.")
    .custom((discount) => {
      if (
        discount &&
        (!Number.isFinite(discount.percentage) ||
          discount.percentage < 0 ||
          discount.percentage > 100)
      ) {
        throw new Error(
          "Поле 'percentage' в 'discount' должно быть числом от 0 до 100."
        );
      }
      if (
        discount &&
        discount.startDate &&
        discount.endDate &&
        new Date(discount.startDate) > new Date(discount.endDate)
      ) {
        throw new Error(
          "Дата начала скидки не может быть позже даты окончания."
        );
      }
      return true;
    }),
];
