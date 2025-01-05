import { body } from "express-validator";

export const sellerValidationRules = {
  create: [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("location.city").notEmpty().withMessage("City is required"),
    body("location.country").notEmpty().withMessage("Country is required"),
  ],
  update: [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email address"),
  ],
};
