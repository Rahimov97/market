export const login = async (phone: string, password: string) => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
  
    if (!response.ok) {
      throw new Error("Ошибка авторизации");
    }
  
    return await response.json();
  };
  