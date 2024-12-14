export const register = async (name: string, phone: string, password: string) => {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, password }),
    });
  
    if (!response.ok) {
      throw new Error("Ошибка регистрации");
    }
  
    return await response.json();
  };
  