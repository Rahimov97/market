import { User } from "../../models/User";
import CustomError from "../../../../errorHandler";
import mongoose from "mongoose";

// Создать пользователя
export const createUser = async (data: any) => {
  const { firstName, lastName, phone, email, password, gender, birthDate, addresses } = data;

  // Проверка обязательных полей
  if (!firstName || !phone) {
    throw new CustomError("Поля 'firstName' и 'phone' обязательны", 400);
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    throw new CustomError("Пользователь с таким номером телефона уже существует", 400);
  }

  const newUser = await User.create({
    firstName,
    lastName,  // lastName может быть пустым
    phone,
    email,
    password,
    gender,
    birthDate,
    addresses,
  });

  return newUser;
};


// Получить список пользователей
export const getUsers = async (filters: any = {}, pagination: { page?: number; limit?: number } = {}) => {
  const { page = 1, limit = 10 } = pagination;

  const users = await User.find(filters)
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await User.countDocuments(filters);

  return { users, total, page, limit };
};

// Получить пользователя по ID
export const getUserById = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Неверный формат ID пользователя", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }

  return user;
};

// Обновить данные пользователя
export const updateUser = async (userId: string, updates: any) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Неверный формат ID пользователя", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true });
  if (!updatedUser) {
    throw new CustomError("Пользователь не найден", 404);
  }

  return updatedUser;
};

// Удалить пользователя
export const deleteUser = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Неверный формат ID пользователя", 400);
  }

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new CustomError("Пользователь не найден", 404);
  }

  return deletedUser;
};

// Добавить продукт в избранное
export const addToFavorites = async (userId: string, productId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new CustomError("Неверный формат ID пользователя или продукта", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }

  if (user.favoriteProducts?.includes(productId as any)) {
    throw new CustomError("Продукт уже находится в избранном", 400);
  }

  user.favoriteProducts?.push(productId as any);
  await user.save();

  return user;
};

// Удалить продукт из избранного
export const removeFromFavorites = async (userId: string, productId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new CustomError("Неверный формат ID пользователя или продукта", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }

  user.favoriteProducts = user.favoriteProducts?.filter((id) => id.toString() !== productId);
  await user.save();

  return user;
};

// Обновить адрес пользователя
export const updateAddress = async (userId: string, addressId: string, addressData: any) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new CustomError("Неверный формат ID пользователя", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }

  const addressIndex = user.addresses?.findIndex(
    (addr) =>
      addr.street === addressData.street &&
      addr.city === addressData.city &&
      addr.country === addressData.country
  );
  
  if (addressIndex === undefined || addressIndex < 0) {
    throw new CustomError("Адрес не найден", 404);
  }

  Object.assign(user.addresses![addressIndex], addressData);
  await user.save();

  return user;
};
