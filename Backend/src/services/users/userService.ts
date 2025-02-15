import { User, IUser } from "../../models/User"; 
import CustomError from "../../../../errorHandler";

// Поиск пользователя по ID
export const findUserById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }
  return user;
};

// Поиск пользователя по email
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email }).select("-password");
};

// Удаление пользователя
export const deleteUser = async (userId: string): Promise<void> => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }
};
