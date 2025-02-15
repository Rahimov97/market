import api from "@/services/api/api";

export const login = async (email: string, password: string) => {
  try {
    console.log("[authApi] Отправка запроса на вход:", { email, password });

    const response = await api.post("/users/login", { email, password });
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("[authApi] Вход успешен, получен токен:", token);
    return response.data;
  } catch (error: any) {
    console.error("[authApi] Ошибка при логине:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "Ошибка при авторизации");
  }
};

export const register = async (firstName: string, phone: string, password: string) => {
  try {
    console.log("[authApi] Отправка данных на регистрацию:", { firstName, phone, password });

    const response = await api.post("/users/register", { firstName, phone, password });

    console.log("[authApi] Регистрация успешна, ответ сервера:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[authApi] Ошибка при регистрации:", error.response?.data || error.message);

    if (error.response?.data?.errors) {
      console.error("[authApi] Детали ошибки валидации:", error.response.data.errors);
    }

    throw new Error(error.response?.data?.message || "Ошибка при регистрации");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("[authApi] Ошибка при получении текущего пользователя:", error);
    return null;
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};
