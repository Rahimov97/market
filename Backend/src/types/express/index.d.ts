import express from "express";
import "express-validator";
import mongoose from "mongoose"; // Для использования ObjectId

declare module "express-validator" {
  interface ValidationError {
    param: string;
    msg: string;
    value?: any;
    location: string;
  }
}

// Интерфейс для пользователя
interface User {
  id: string | mongoose.Schema.Types.ObjectId; // id может быть и строкой, и ObjectId
  role: string | mongoose.Schema.Types.ObjectId; // role может быть и строкой, и ObjectId
  email?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User; // Расширение Request с полем user
    }
  }
}
