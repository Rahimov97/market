import { body } from "express-validator";

export const registerValidation = [
  body("firstName").notEmpty().withMessage("First name is required."),
  body("phone").isMobilePhone("any").withMessage("Valid phone number is required."),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
];

export const loginValidation = [
  body("phone").isMobilePhone("any").withMessage("Valid phone number is required."),
  body("password").notEmpty().withMessage("Password is required."),
];
