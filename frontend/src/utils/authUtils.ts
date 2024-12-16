export interface DecodedToken {
    id: string;
    role: string;
    firstName?: string;
    email?: string;
    exp: number; // Время истечения токена
  }
  
  export const saveToken = (token: string) => {
    localStorage.setItem("token", token);
  };
  
  export const getToken = (): string | null => {
    return localStorage.getItem("token");
  };
  
  export const removeToken = () => {
    localStorage.removeItem("token");
  };
  
  export const decodeToken = (token: string): DecodedToken | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload as DecodedToken;
    } catch {
      return null;
    }
  };
  
  export const isTokenValid = (token: string): boolean => {
    const payload = decodeToken(token);
    if (!payload) return false;
  
    const now = Math.floor(Date.now() / 1000); // Текущее время
    return payload.exp > now;
  };
  