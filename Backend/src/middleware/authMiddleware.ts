import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Интерфейс для декодированного токена
export interface DecodedToken {
  id: string;
  role: string;
}

// Расширенный интерфейс для объекта Request
export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Middleware для проверки токена
export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    // Устанавливаем свойство user
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware для проверки роли
export const checkRole = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
      return;
    }
    next();
  };
};
