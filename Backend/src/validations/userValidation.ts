import { body } from "express-validator";

export const profileValidation = [
  body("firstName").optional().isString().withMessage("First name must be a string"),
  body("lastName").optional().isString().withMessage("Last name must be a string"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("phone").optional().isMobilePhone("any").withMessage("Invalid phone number"),
  body("gender").optional().isIn(["male", "female", "other"]).withMessage("Invalid gender value"),
  body("birthDate").optional().isISO8601().withMessage("Birth date must be a valid date"),
  body("password")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Password must be at least 2 characters long"),
];
