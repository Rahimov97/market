import { Request, Response, NextFunction } from 'express';

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Не найдено - ${req.originalUrl}`, 404);
  next(error);
};

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode =
    err instanceof CustomError
      ? err.statusCode
      : res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  const errorResponse = {
    status: 'error',
    message: err.message || 'Ошибка сервера',
    statusCode,
    details: isProduction ? null : err.stack,
    path: req.originalUrl,
    method: req.method,
  };

  res.status(statusCode).json(errorResponse);
};
