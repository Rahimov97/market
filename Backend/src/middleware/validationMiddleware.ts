import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";

const validationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Форматируем ошибки для более понятного ответа
    const formattedErrors = errors.array().map((error) => {
      const field = "param" in error ? error.param : "unknown";
      return {
        field,
        message: error.msg,
      };
    });

    res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: formattedErrors,
    });
    return;
  }

  next();
};

export default validationMiddleware;
