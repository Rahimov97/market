import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { generateToken } from "./utils";
import CustomError from "../../utils/errorHandler";

// Авторизация пользователя
export const loginBuyer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Проверяем наличие пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("Неверный email или пароль", 401);
    }

    // Проверяем совпадение пароля
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new CustomError("Неверный email или пароль", 401);
    }

    // Генерация токена с учетом роли
    const token = generateToken(user._id.toString(), user.role.toString());

    // Отправляем ответ с токеном и данными пользователя
    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        role: user.role, // Добавляем роль в ответ
      },
    });
  } catch (error) {
    next(error);
  }
};
