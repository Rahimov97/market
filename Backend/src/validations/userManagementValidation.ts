import { check, validationResult, type ValidationError, type Result } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Валидация создания пользователя
export const validateCreateUser = [
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'firstName' обязательно.")
    .isString()
    .withMessage("Поле 'firstName' должно быть строкой.")
    .isLength({ min: 2 })
    .withMessage("Поле 'firstName' должно содержать минимум 2 символа."),
  check("lastName")
    .optional()
    .isString()
    .withMessage("Поле 'lastName' должно быть строкой.")
    .isLength({ min: 2 })
    .withMessage("Поле 'lastName' должно содержать минимум 2 символа."),
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'email' обязательно.")
    .isEmail()
    .withMessage("Поле 'email' должно быть валидным email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'password' обязательно.")
    .isString()
    .withMessage("Поле 'password' должно быть строкой.")
    .isLength({ min: 6 })
    .withMessage("Поле 'password' должно содержать минимум 6 символов.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/)
    .withMessage(
      "Поле 'password' должно содержать хотя бы одну букву, одну цифру и один специальный символ."
    ),
  check("phone")
    .exists({ checkFalsy: true })
    .withMessage("Поле 'phone' обязательно.")
    .isString()
    .withMessage("Поле 'phone' должно быть строкой.")
    .matches(/^\+(\d{1,3})[- ]?\d{10}$/)
    .withMessage("Поле 'phone' должно быть валидным номером телефона, начинающимся с '+'."),
  check("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Поле 'gender' должно быть 'male', 'female' или 'other'."),
  check("birthDate")
    .optional()
    .isISO8601()
    .withMessage("Поле 'birthDate' должно быть валидной датой.")
    .custom((date) => new Date(date) <= new Date())
    .withMessage("Поле 'birthDate' не может быть в будущем."),
];

// Валидация обновления пользователя
export const validateUpdateUser = [
  check("firstName")
    .optional()
    .isString()
    .withMessage("Поле 'firstName' должно быть строкой.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Поле 'firstName' должно содержать от 2 до 50 символов."),
  check("lastName")
    .optional()
    .isString()
    .withMessage("Поле 'lastName' должно быть строкой.")
    .isLength({ max: 50 })
    .withMessage("Поле 'lastName' не должно превышать 50 символов."),
  check("phone")
    .optional()
    .isString()
    .withMessage("Поле 'phone' должно быть строкой.")
    .matches(/^\+(\d{1,3})[- ]?\d{10}$/)
    .withMessage("Поле 'phone' должно быть валидным номером телефона, начинающимся с '+'."),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Поле 'email' должно быть валидным email."),
  check("password")
    .optional()
    .isString()
    .withMessage("Поле 'password' должно быть строкой.")
    .isLength({ min: 6 })
    .withMessage("Поле 'password' должно содержать минимум 6 символов."),
  check("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Поле 'gender' должно быть 'male', 'female' или 'other'."),
  check("birthDate")
    .optional()
    .isISO8601()
    .withMessage("Поле 'birthDate' должно быть валидной датой.")
    .custom((date) => {
      const parsedDate = new Date(date);
      if (parsedDate.toString() === "Invalid Date") {
        throw new Error("Некорректная дата");
      }
      if (parsedDate > new Date()) {
        throw new Error("Поле 'birthDate' не может быть в будущем.");
      }
      return true;
    }),
];

// Middleware для обработки ошибок валидации
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: Result = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      status: "error",
      message: "Ошибка валидации данных",
      errors: errors.array().map((err) => ({
        field: err.param || "unknown", // Используем err.param для указания поля
        message: err.msg,
      })),
    });
    return;
  }

  next();
};
