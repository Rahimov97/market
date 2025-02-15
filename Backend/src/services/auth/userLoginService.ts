import { User } from "../../models/User";
import { generateToken } from "../../controllers/Auth/utils";
import CustomError from "../../../../errorHandler";

// Вход пользователя
export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: any }> => {
  // Находим пользователя по email
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("Неверный email или пароль", 401);
  }

  // Проверяем пароль
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new CustomError("Неверный email или пароль", 401);
  }

  // Генерируем токен, добавляя роль пользователя
  const token = generateToken(user._id.toString(), user.role.toString());

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      role: user.role, // Включаем роль в ответ
    },
  };
};
