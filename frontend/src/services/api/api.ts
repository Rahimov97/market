import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error("[api] Ошибка получения токена из localStorage:", error);
      return config;
    }
  },
  (error) => {
    console.error("[api] Ошибка в интерсепторе запроса:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response) {
      console.error(`[api] Ошибка в ответе сервера: ${error.response.status} -`, error.response.data);
    } else if (error.request) {
      console.error("[api] Ошибка запроса: сервер не ответил.", error.request);
    } else {
      console.error("[api] Ошибка при настройке запроса:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
