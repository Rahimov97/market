import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken, saveToken } from "@/utils/authUtils";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  fetchUserProfile: () => Promise<void>;
  authenticate: (isLogin: boolean, payload: AuthPayload) => Promise<void>;
}

interface AuthPayload {
  firstName?: string;
  phone: string;
  password: string;
}

interface User {
  id: string;
  role: string;
  firstName?: string;
  email?: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const decodeToken = (token: string): User | null => {
    try {
      return jwtDecode<User>(token);
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
      return null;
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.get(`/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setIsAuthenticated(true);
        setUser({ ...response.data });
      }
    } catch (error) {
      console.error("Ошибка загрузки профиля пользователя:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          await fetchUserProfile();
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = (token: string) => {
    saveToken(token);
    fetchUserProfile();
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/auth", { replace: true });
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedUser } : null));
  };

  const authenticate = async (isLogin: boolean, payload: AuthPayload) => {
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";
    const response = await axios.post(url, payload);

    if (response.data?.token) {
      login(response.data.token);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        updateUser,
        fetchUserProfile,
        authenticate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
