import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Используем относительный путь, чтобы прокси Vite перенаправлял запросы
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерсептор для добавления токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Изменяем "authToken" на "token"
    console.log("Token in interceptor:", token); // Логируем токен для отладки
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
