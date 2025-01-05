import { ObjectId } from "mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Переменная окружения JWT_SECRET не определена.");
}

// Интерфейс для декодированного токена
interface DecodedToken {
  id: string;
  role: string;
}

// Генерация токена
export const generateToken = (userId: string | ObjectId, role: string): string => {
  console.info(`[utils] Генерация токена для userId: ${userId}, role: ${role}`);
  return jwt.sign({ id: userId.toString(), role }, JWT_SECRET, { expiresIn: "1d" });
};

// Проверка токена
export const verifyToken = (token: string): DecodedToken | null => {
  try {
    console.info(`[utils] Проверка токена`);
    const decoded = jwt.verify(token, JWT_SECRET);

    // Проверяем, что `decoded` содержит поля `id` и `role`
    if (
      typeof decoded !== "object" ||
      !decoded ||
      !("id" in decoded) ||
      !("role" in decoded)
    ) {
      console.error("[utils] Ошибка: токен не содержит необходимых полей 'id' и 'role'.");
      return null;
    }

    return decoded as DecodedToken;
  } catch (err) {
    console.error(
      "[utils] Ошибка проверки токена:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
};
