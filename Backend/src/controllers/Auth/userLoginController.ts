import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { generateToken } from "./utils";
import CustomError from "../../utils/errorHandler";
import { Role } from "../../models/Role";

export const loginBuyer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError("Неверный email или пароль", 401);
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new CustomError("Неверный email или пароль", 401);
    }

    if (!user.role) {
      console.error(`[loginBuyer] Ошибка: у пользователя ID=${user._id} нет роли.`);
      throw new CustomError("Ошибка системы: у пользователя отсутствует роль", 500);
    }

    const role = await Role.findById(user.role);
    if (!role) {
      console.error(`[loginBuyer] Ошибка: роль пользователя ID=${user._id} не найдена в БД.`);
      throw new CustomError("Ошибка системы: роль пользователя не найдена", 500);
    }

    const token = generateToken(user._id.toString(), role.name);

    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        role: role.name, 
      },
    });
  } catch (error) {
    next(error);
  }
};