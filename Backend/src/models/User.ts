import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  password?: string;
  role: 'user' | 'seller' | 'admin'; // Возможные роли
  avatar?: string; // Поле для аватара
  gender?: 'male' | 'female' | 'other'; // Пол пользователя
  birthDate?: Date; // Дата рождения
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
    avatar: { type: String }, // Поле для хранения пути аватара
    gender: { type: String, enum: ['male', 'female', 'other'] },
    birthDate: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
