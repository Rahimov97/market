import { useState } from "react";
import { login } from "../api/login";
import { register } from "../api/register";
import { useAuthContext } from "@/context/AuthContext";

interface AuthPayload {
  firstName?: string;
  phone: string;
  password: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: setAuthContext } = useAuthContext();

  const authenticate = async (isLogin: boolean, payload: AuthPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = isLogin
        ? await login(payload.phone, payload.password)
        : await register(payload.firstName || "", payload.phone, payload.password);

      if (!response.token) {
        throw new Error("Не удалось получить токен. Проверьте ответ сервера.");
      }

      setAuthContext(response.token); // Устанавливаем токен в AuthContext
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Произошла неизвестная ошибка. Попробуйте снова.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { authenticate, loading, error };
};
