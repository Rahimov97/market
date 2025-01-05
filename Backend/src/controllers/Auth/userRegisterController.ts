import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import { generateToken } from "./utils";
import CustomError from "../../utils/errorHandler";

export const registerBuyer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, phone, email, password, birthDate } = req.body;

    // Проверяем роль "user"
    let userRole = await Role.findOne({ name: "user" });
    if (!userRole) {
      console.log("Роль 'user' отсутствует. Создаем роль автоматически...");
      userRole = await Role.create({
        name: "user",
        permissions: [],
        description: "Default role for regular users",
      });
    }

    // Проверяем на существование пользователя
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      throw new CustomError("Пользователь с таким email или телефоном уже существует", 400);
    }

    // Создаем нового пользователя
    const user = new User({
      firstName,
      lastName,
      phone,
      email,
      password,
      birthDate,
      role: userRole._id, // Присваиваем роль "user"
    });
    await user.save();

    // Генерация токена с учетом роли
    const token = generateToken(user._id.toString(), userRole.name);

    // Ответ с токеном и данными пользователя
    res.status(201).json({
      status: "success",
      message: "Регистрация прошла успешно",
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        birthDate: user.birthDate,
        role: userRole.name, // Добавляем роль в ответ
      },
    });
  } catch (error) {
    next(error);
  }
};
