import { User } from "../../models/User";
import { generateToken } from "../../controllers/Auth/utils";
import CustomError from "../../utils/errorHandler";

// Регистрация пользователя
export const registerUser = async (
  firstName: string,
  lastName: string | undefined,
  phone: string,
  email: string | undefined,
  password: string
): Promise<{ token: string; user: any }> => {
  // Проверка существующего пользователя
  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    throw new CustomError("Пользователь с таким email или телефоном уже существует", 400);
  }

  // Создание нового пользователя
  const user = new User({
    firstName,
    lastName,
    phone,
    email,
    password,
    role: "user", // Устанавливаем роль по умолчанию
  });
  await user.save();

  // Генерация токена с учетом роли
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
