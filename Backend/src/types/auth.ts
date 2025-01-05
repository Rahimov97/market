import mongoose from "mongoose";

export interface AuthToken {
  id: string; // ID пользователя
  iat: number; // Время создания токена
  exp: number; // Время истечения токена
}

export interface UserData {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  role: string | mongoose.Schema.Types.ObjectId;
  avatar?: string;
  gender?: "male" | "female" | "other";
  birthDate?: Date;
}
