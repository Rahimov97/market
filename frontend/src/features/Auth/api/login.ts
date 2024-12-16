const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const login = async (phone: string, password: string) => {
  try {
    console.log("API_URL:", API_URL); // Логируем базовый URL

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text(); // Логируем текстовый ответ
      console.error("Response body (non-JSON):", text);
      throw new Error("Сервер вернул некорректный формат данных");
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Ошибка с сервера:", errorData);
      throw new Error(errorData.message || "Ошибка авторизации");
    }

    const data = await response.json();
    console.log("Успешный ответ от сервера:", data); // Логируем успешный ответ
    return data;
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    throw error;
  }
};
