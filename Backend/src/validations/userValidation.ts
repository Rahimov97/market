import { body } from "express-validator";

// Валидация для обновления профиля
export const updateProfileValidation = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("Имя должно быть строкой"),
  body("lastName")
    .optional()
    .isString()
    .withMessage("Фамилия должна быть строкой"),
  body("phone")
    .optional()
    .isString()
    .withMessage("Телефон должен быть строкой")
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/)
    .withMessage("Телефон имеет некорректный формат"),
    body("email")
    .optional()
    .isEmail()
    .withMessage("Введите корректный email, например example@mail.com"),  
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Пол может быть только male, female или other"),
  body("birthDate")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Дата рождения должна быть корректной"),
    body("addresses")
    .optional()
    .isArray()
    .withMessage("Адреса должны быть массивом")
    .custom((addresses) => {
      addresses.forEach((address: any) => {
        if (typeof address.street !== "string" || address.street.trim() === "") {
          throw new Error("Поле street в адресе должно быть строкой");
        }
        if (typeof address.city !== "string" || address.city.trim() === "") {
          throw new Error("Поле city в адресе должно быть строкой");
        }
        if (typeof address.country !== "string" || address.country.trim() === "") {
          throw new Error("Поле country в адресе должно быть строкой");
        }
        if (typeof address.zipCode !== "string" || address.zipCode.trim() === "") {
          throw new Error("Поле zipCode в адресе должно быть строкой");
        }
      });
      return true;
    }),  
];

// Валидация для обновления аватара
export const updateAvatarValidation = [
  body("avatar")
    .isString()
    .withMessage("URL аватара должен быть строкой")
    .matches(/^(https?:\/\/.*\.(?:png|jpg|jpeg|svg))$/i)
    .withMessage("URL аватара должен быть ссылкой на изображение"),
];
