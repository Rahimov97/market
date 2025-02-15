import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { verifyToken } from "./utils";
import CustomError from "../../../../errorHandler";
import mongoose from "mongoose";

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Токен отсутствует или некорректный", 401);
    }

    const token = authHeader.split(" ")[1];
    console.info("[checkAuth] Токен получен:", token);

    const decoded = verifyToken(token);
    console.info("[checkAuth] Декодированный токен:", decoded);

    if (!decoded || !decoded.id || !decoded.role) {
      throw new CustomError("Недействительный токен: отсутствуют поля id/role", 401);
    }

    const user = await User.findById(decoded.id).select("role");
    if (!user || !user.role) {
      throw new CustomError("Пользователь не найден или у него нет роли", 404);
    }

    req.user = {
      id: decoded.id,
      role: user.role.toString(),
    };

    console.info(`[checkAuth] Авторизован: ID=${req.user.id}, Роль=${req.user.role}`);
    next();
  } catch (error) {
    console.error("[checkAuth] Ошибка авторизации:", error);
    next(error);
  }
};


// Получение профиля
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError("Пользователь не авторизован", 401);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new CustomError("Пользователь не найден", 404);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
