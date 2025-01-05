import api from "@/services/api/api";

// Вход в систему
export const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  const { token } = response.data;

  // Сохраняем токен
  localStorage.setItem("token", token); // Используем "token" в нижнем регистре

  return response.data;
};

// Регистрация
export const register = async (email: string, password: string, name: string) => {
  const response = await api.post("/auth/register", { email, password, name });
  return response.data;
};

// Выход из системы
export const logout = () => {
  localStorage.removeItem("token");
};
