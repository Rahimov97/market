import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Правила для валидации создания роли
export const validateCreateRole = [
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'name' обязательно.")
    .isString()
    .withMessage("Поле 'name' должно быть строкой.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Поле 'name' должно содержать от 3 до 50 символов."),
  check("permissions")
    .optional()
    .isArray()
    .withMessage("Поле 'permissions' должно быть массивом.")
    .custom((permissions) =>
      permissions.every((permission: string) => /^[0-9a-fA-F]{24}$/.test(permission))
    )
    .withMessage("Каждый элемент 'permissions' должен быть валидным ObjectId."),
  check("description")
    .optional()
    .isString()
    .withMessage("Поле 'description' должно быть строкой.")
    .isLength({ max: 200 })
    .withMessage("Поле 'description' не должно превышать 200 символов."),
];

// Правила для валидации обновления роли
export const validateUpdateRole = [
  check("name")
    .optional()
    .isString()
    .withMessage("Поле 'name' должно быть строкой.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Поле 'name' должно содержать от 3 до 50 символов."),
  check("permissions")
    .optional()
    .isArray()
    .withMessage("Поле 'permissions' должно быть массивом.")
    .custom((permissions) =>
      permissions.every((permission: string) => /^[0-9a-fA-F]{24}$/.test(permission))
    )
    .withMessage("Каждый элемент 'permissions' должен быть валидным ObjectId."),
  check("description")
    .optional()
    .isString()
    .withMessage("Поле 'description' должно быть строкой.")
    .isLength({ max: 200 })
    .withMessage("Поле 'description' не должно превышать 200 символов."),
];

// Middleware для обработки ошибок валидации
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: "error",
        message: "Ошибка валидации данных",
        errors: errors.array(),
      });
      return; // Возвращаем, чтобы завершить выполнение функции
    }
    next(); // Переходим к следующему middleware, если ошибок нет
  };
