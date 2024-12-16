const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const register = async (firstName: string, phone: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, phone, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка регистрации");
  }

  return await response.json();
};
