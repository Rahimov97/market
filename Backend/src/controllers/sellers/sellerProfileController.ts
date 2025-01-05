import { Request, Response, NextFunction } from "express";
import { Seller } from "../../models/Seller"; // Импорт модели продавцов
import { CustomError } from "../../middleware/errorMiddleware"; // Импорт кастомного класса ошибок
import mongoose from "mongoose";

// Расширение глобального типа Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | mongoose.Types.ObjectId;
        role: string | mongoose.Types.ObjectId;
      };
    }
  }
}


// Получение профиля продавца
export const getSellerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) throw new CustomError("Unauthorized access", 401); // Проверяем авторизацию

    const sellerId = req.user.id;
    const seller = await Seller.findById(sellerId).select("-password -bankDetails"); // Исключаем пароль и банковские данные

    if (!seller) throw new CustomError("Seller not found", 404);

    res.status(200).json(seller); // Возвращаем данные продавца
  } catch (error) {
    next(error); // Передаем ошибку глобальному обработчику
  }
};

// Обновление профиля продавца
export const updateSellerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) throw new CustomError("Unauthorized access", 401); // Проверяем авторизацию

    const sellerId = req.user.id;
    const updates = req.body;

    const updatedSeller = await Seller.findByIdAndUpdate(sellerId, updates, {
      new: true,
      runValidators: true, // Проверяем валидность обновляемых данных
    }).select("-password"); // Исключаем пароль

    if (!updatedSeller) throw new CustomError("Seller not found", 404);

    res.status(200).json(updatedSeller); // Возвращаем обновленные данные продавца
  } catch (error) {
    next(error); // Передаем ошибку глобальному обработчику
  }
};
