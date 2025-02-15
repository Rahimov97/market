import { User } from "../../models/User";
import CustomError from "../../../../errorHandler";
import mongoose from "mongoose";

// Проверка роли пользователя
export const checkUserRole = async (userId: string, requiredRoleId: string): Promise<void> => {
  const user = await User.findById(userId).select("role");
  if (!user) {
    throw new CustomError("Пользователь не найден", 404);
  }

  // Преобразование role и requiredRoleId в ObjectId и сравнение
  const userRoleId = new mongoose.Types.ObjectId(user.role.toString());
  const requiredRoleObjectId = new mongoose.Types.ObjectId(requiredRoleId);

  if (!userRoleId.equals(requiredRoleObjectId)) {
    throw new CustomError("Доступ запрещён", 403);
  }
};
