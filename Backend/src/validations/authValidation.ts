import { body } from "express-validator";

export const registerValidation = [
  body("firstName")
    .isString()
    .withMessage("Имя должно быть строкой")
    .notEmpty()
    .withMessage("Имя обязательно"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Фамилия должна быть строкой"),

  body("phone")
    .isString()
    .withMessage("Телефон должен быть строкой")
    .notEmpty()
    .withMessage("Телефон обязателен")
    .matches(/^\+?\d{10,15}$/)
    .withMessage("Некорректный номер телефона. Допустимый формат: +1234567890"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Некорректный формат email"),

  body("password")
    .isString()
    .withMessage("Пароль должен быть строкой")
    .notEmpty()
    .withMessage("Пароль обязателен")
    .isLength({ min: 6 })
    .withMessage("Пароль должен содержать минимум 6 символов"),

  body("birthDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Дата рождения должна быть корректной")
    .custom((value) => {
      if (value > new Date()) {
        throw new Error("Дата рождения не может быть в будущем");
      }
      return true;
    }),
];

export const loginValidation = [
  body("email")
    .isString()
    .withMessage("Email должен быть строкой")
    .notEmpty()
    .withMessage("Email обязателен")
    .isEmail()
    .withMessage("Некорректный формат email"),

  body("password")
    .isString()
    .withMessage("Пароль должен быть строкой")
    .notEmpty()
    .withMessage("Пароль обязателен"),
];
