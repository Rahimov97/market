import { useState } from "react";
import { login } from "../api/login";
import { register } from "../api/register";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Сделано null для более точной проверки

  const authenticate = async (isLogin: boolean, payload: { name?: string; phone: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = isLogin
        ? await login(payload.phone, payload.password)
        : await register(payload.name || "", payload.phone, payload.password);

      if (!response.token) {
        throw new Error("Не удалось получить токен. Проверьте ответ сервера.");
      }

      localStorage.setItem("token", response.token);
      return response; // Возвращаем полный ответ для последующего использования
    } catch (err: any) {
      // Подробная обработка ошибок
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Ошибка с сервера
      } else if (err.message) {
        setError(err.message); // Локальная ошибка
      } else {
        setError("Произошла неизвестная ошибка. Попробуйте снова."); // Общая ошибка
      }

      throw err; // Пробрасываем ошибку для возможной дополнительной обработки
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, authenticate };
};
