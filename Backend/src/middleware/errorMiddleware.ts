import { Request, Response, NextFunction } from 'express';

// Класс кастомной ошибки
export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

// Обработчик для несуществующих маршрутов
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Централизованный обработчик ошибок
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  const statusCode =
    err instanceof CustomError
      ? err.statusCode
      : res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  const response = {
    status: 'error',
    message: err.message || 'Server Error',
    details: process.env.NODE_ENV === 'production' ? null : err.stack, // Stacktrace скрывается в production
    path: req.originalUrl, // Указывает, на каком маршруте произошла ошибка
    method: req.method, // Указывает, какой метод вызвал ошибку
  };

  res.status(statusCode).json(response);
};
