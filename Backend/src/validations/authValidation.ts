import { body } from "express-validator";

// Валидация для регистрации
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
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage("Телефон имеет некорректный формат"),
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
    .withMessage("Пароль должен содержать минимум 6 символов")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage("Пароль должен содержать хотя бы одну букву, одну цифру и один специальный символ"),  
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

// Валидация для входа
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
