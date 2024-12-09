import { Request, Response, NextFunction } from 'express';

// Обработчик ошибок
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  
    res.status(statusCode).json({
      status: "error",
      message: err.message || "Server Error",
      details: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  };  

// Обработчик для несуществующих маршрутов
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
