import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  phone: string;
  lastName?: string;
  email?: string;
  password?: string;
  role: 'user' | 'seller' | 'admin'; // Возможные роли
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    lastName: { type: String }, // Сделано необязательным
    email: { type: String, unique: true }, // Сделано необязательным
    password: { type: String }, // Сделано необязательным
    role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  },
  { timestamps: true } // Автоматически добавляет createdAt и updatedAt
);

export const User = mongoose.model<IUser>('User', userSchema);
