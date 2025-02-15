import { User, IUser } from "../../models/User"; 
import CustomError from "../../../../errorHandler";

// Получение профиля пользователя
export const getProfile = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId).select("-password").populate("orderHistory cart");
  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }
  return user;
};

// Обновление данных профиля
export const updateProfile = async (
  userId: string,
  updates: Partial<IUser>
): Promise<IUser> => {
  const allowedUpdates = [
    "firstName",
    "lastName",
    "phone",
    "email",
    "gender",
    "birthDate",
    "addresses",
  ];
  const updateKeys = Object.keys(updates);

  const isValidUpdate = updateKeys.every((key) => allowedUpdates.includes(key));
  if (!isValidUpdate) {
    throw new CustomError("Некорректные поля для обновления", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }

  return user;
};

// Обновление аватара пользователя
export const updateAvatar = async (userId: string, avatarUrl: string): Promise<IUser> => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { avatar: avatarUrl } },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }

  return user;
};

// Добавление нового адреса
export const addAddress = async (
  userId: string,
  newAddress: {
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode: string;
    isDefault?: boolean;
  }
): Promise<IUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }

  // Если адрес по умолчанию, сбросить предыдущие "isDefault"
  if (newAddress.isDefault) {
    user.addresses?.forEach((address) => (address.isDefault = false));
  }

  user.addresses?.push(newAddress);
  await user.save();

  return user;
};

// Удаление адреса
export const removeAddress = async (userId: string, addressIndex: number): Promise<IUser> => {
  const user = await User.findById(userId);

  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }

  if (!user.addresses || user.addresses.length <= addressIndex) {
    throw new CustomError("Адрес не найден", 404);
  }

  user.addresses.splice(addressIndex, 1);
  await user.save();

  return user;
};
