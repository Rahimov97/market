import { Request, Response, NextFunction } from "express";
import * as userService from "../../services/admin/userService";
import CustomError from "../../../../errorHandler";

// Универсальная функция для ответа
const sendResponse = (res: Response, message: string, data: any) => {
  res.status(200).json({
    status: "success",
    message,
    data,
  });
};

// 1. Создать пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName, phone, gender, birthDate, role } = req.body;

    // Проверка обязательных полей
    if (!email || !password) {
      throw new CustomError("Необходимо указать email и password", 400);
    }

    // Проверка phone на наличие
    if (!phone) {
      throw new CustomError("Необходимо указать номер телефона", 400);
    }

    // Проверка firstName на обязательность
    if (!firstName) {
      throw new CustomError("Необходимо указать имя (firstName)", 400);
    }

    // Проверка роли, если она не указана, ставим роль 'user'
    const userRole = role || "user";

    const newUser = await userService.createUser({
      email,
      password,
      firstName,
      lastName,
      phone,
      gender,
      birthDate,
      role: userRole,  // Устанавливаем роль
    });

    sendResponse(res, "Пользователь успешно создан", newUser);
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Ошибка создания пользователя", 500));
  }
};

// 2. Получить список пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = req.query;
    const { page, limit } = req.query;
    const users = await userService.getUsers(filters, { page: Number(page), limit: Number(limit) });
    sendResponse(res, "Список пользователей успешно получен", users);
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Ошибка получения списка пользователей", 500));
  }
};

// 3. Получить пользователя по ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendResponse(res, "Данные пользователя успешно получены", user);
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Ошибка получения данных пользователя", 500));
  }
};

// 4. Обновить пользователя
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    sendResponse(res, "Данные пользователя успешно обновлены", updatedUser);
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Ошибка обновления данных пользователя", 500));
  }
};

// 5. Удалить пользователя
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedUser = await userService.deleteUser(req.params.id);
    sendResponse(res, "Пользователь успешно удален", deletedUser);
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Ошибка удаления пользователя", 500));
  }
};

// 6. Добавить продукт в избранное
export const addToFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await userService.addToFavorites(req.params.id, req.body.productId);
    sendResponse(res, "Продукт успешно добавлен в избранное", updatedUser);
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Ошибка добавления продукта в избранное", 500));
  }
};

// 7. Удалить продукт из избранного
export const removeFromFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await userService.removeFromFavorites(req.params.id, req.body.productId);
    sendResponse(res, "Продукт успешно удален из избранного", updatedUser);
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Ошибка удаления продукта из избранного", 500));
  }
};

// 8. Обновить адрес пользователя
export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await userService.updateAddress(req.params.id, req.body.addressId, req.body);
    sendResponse(res, "Адрес пользователя успешно обновлен", updatedUser);
  } catch (error) {
    next(error instanceof CustomError ? error : new CustomError("Ошибка обновления адреса пользователя", 500));
  }
};
