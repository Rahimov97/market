import dotenv from "dotenv";
dotenv.config();
import { RequestHandler, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { User } from "../models/User";
import { Seller } from "../models/Seller";

if (!process.env.JWT_SECRET) {
  throw new Error("Переменная окружения JWT_SECRET не определена.");
}

interface DecodedToken {
  id: string | ObjectId;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

const handleAuthError = (res: Response, message: string): void => {
  res.status(401).json({ status: "error", message });
};

const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    handleAuthError(res, "Доступ запрещен. Токен отсутствует или недействителен.");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded || !decoded.id || !decoded.role) {
      handleAuthError(res, "Недействительный токен.");
      return;
    }

    const userId = typeof decoded.id === "string" ? decoded.id : decoded.id.toString();
    const user =
      decoded.role === "seller"
        ? await Seller.findById(userId).select("role")
        : await User.findById(userId).select("role");

    if (!user) {
      handleAuthError(res, "Пользователь не найден.");
      return;
    }

    req.user = { id: userId, role: decoded.role };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      handleAuthError(res, "Токен истёк. Пожалуйста, выполните вход заново.");
    } else {
      handleAuthError(res, "Недействительный токен.");
    }
  }
};

export const roleMiddleware = (allowedRoles: string | string[]): RequestHandler => {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user || !rolesArray.includes(req.user.role)) {
      res.status(403).json({ status: "error", message: "Доступ запрещён. Недостаточно прав." });
      return;
    }
    next();
  };
};

export default authMiddleware;
