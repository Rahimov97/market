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

// Обработчик ошибок авторизации
const handleAuthError = (res: Response, message: string): void => {
  console.warn(`[authMiddleware] Ошибка авторизации: ${message}`);
  res.status(401).json({ status: "error", message });
};

// Middleware для проверки токена
const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("[authMiddleware] Токен отсутствует или имеет неверный формат.");
    handleAuthError(res, "Доступ запрещен. Токен отсутствует или недействителен.");
    return;
  }

  const token = authHeader.split(" ")[1];
  console.info(`[authMiddleware] Получен токен: ${token}`);

  try {
    console.log("[authMiddleware] Проверка токена:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

    if (!decoded || !decoded.id || !decoded.role) {
      console.warn("[authMiddleware] Токен не содержит необходимых данных (id/role).");
      handleAuthError(res, "Недействительный токен.");
      return;
    }

    const userId = typeof decoded.id === "string" ? decoded.id : decoded.id.toString();
    console.info(`[authMiddleware] Декодирован ID пользователя: ${userId}, Роль: ${decoded.role}`);

    // Проверка пользователя или продавца
    const user =
      decoded.role === "seller"
        ? await Seller.findById(userId).select("role")
        : await User.findById(userId).select("role");

    if (!user) {
      console.warn(`[authMiddleware] Пользователь с ID=${userId}, Роль=${decoded.role} не найден.`);
      handleAuthError(res, "Пользователь не найден.");
      return;
    }

    req.user = {
      id: userId,
      role: decoded.role,
    };

    console.info(`[authMiddleware] Авторизация успешна: ID=${req.user.id}, Роль=${req.user.role}`);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.warn("[authMiddleware] Токен истёк.");
      handleAuthError(res, "Токен истёк. Пожалуйста, выполните вход заново.");
    } else if (error instanceof Error) {
      console.error("[authMiddleware] Ошибка проверки токена:", error.message);
      handleAuthError(res, "Недействительный токен.");
    } else {
      console.error("[authMiddleware] Неизвестная ошибка:", error);
      handleAuthError(res, "Произошла ошибка при проверке токена.");
    }
  }
};

// Middleware для проверки ролей
export const roleMiddleware = (allowedRoles: string | string[]): RequestHandler => {
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user || !rolesArray.includes(req.user.role)) {
      console.warn(
        `[roleMiddleware] Доступ запрещён для пользователя ID=${req.user?.id || "неизвестен"}. Роль: ${
          req.user?.role || "не указана"
        }, Разрешённые роли: ${rolesArray.join(", ")}`
      );
      res.status(403).json({ status: "error", message: "Доступ запрещён. Недостаточно прав." });
      return;
    }

    console.info(
      `[roleMiddleware] Доступ разрешён для пользователя ID=${req.user.id}, Роль=${req.user.role}`
    );
    next();
  };
};

export default authMiddleware;
