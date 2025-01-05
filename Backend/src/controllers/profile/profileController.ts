import { Request, Response, NextFunction } from "express";
import {
  getProfile,
  updateProfile,
  updateAvatar,
  addAddress,
  removeAddress,
} from "../../services/users/profileService";
import CustomError from "../../utils/errorHandler";

// Получение профиля
export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError("Пользователь не авторизован", 401);
    }

    const profile = await getProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

// Обновление профиля
export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError("Пользователь не авторизован", 401);
    }

    const updatedProfile = await updateProfile(userId, req.body);
    res.status(200).json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

// Обновление аватара
export const updateAvatarController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError("Пользователь не авторизован", 401);
    }

    const { avatar } = req.body;
    if (!avatar) {
      throw new CustomError("URL аватара обязателен", 400);
    }

    const updatedProfile = await updateAvatar(userId, avatar);
    res.status(200).json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

// Добавление адреса
export const addAddressController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new CustomError("Пользователь не авторизован", 401);
    }

    const newAddress = req.body;
    const updatedProfile = await addAddress(userId, newAddress);
    res.status(200).json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

// Удаление адреса
export const removeAddressController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { index } = req.params;

    if (!userId) {
      throw new CustomError("Пользователь не авторизован", 401);
    }

    if (!index) {
      throw new CustomError("Не указан индекс адреса", 400);
    }

    const updatedProfile = await removeAddress(userId, parseInt(index, 10));
    res.status(200).json(updatedProfile);
  } catch (error) {
    next(error);
  }
};
