import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { verifyToken } from "./utils";
import CustomError from "../../utils/errorHandler";
import mongoose from "mongoose";

// Middleware для проверки авторизации
export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError("Токен отсутствует или некорректный", 401);
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received:", token);

    console.log("Calling verifyToken with token:", token);
    const decoded = verifyToken(token);
    console.log("Decoded token:", decoded);

    if (!decoded || !decoded.id) {
      throw new CustomError("Невалидный токен: отсутствует поле id", 401);
    }

    // Находим пользователя
    const user = await User.findById(decoded.id).select("role");
    console.log("User found:", user);

    if (!user) {
      throw new CustomError("Пользователь не найден", 404);
    }

    // Приведение role к строке
    req.user = {
      id: decoded.id,
      role: user.role.toString(), // Преобразование роли в строку
    };

    next();
  } catch (error) {
    console.error("Error in checkAuth:", error);
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
