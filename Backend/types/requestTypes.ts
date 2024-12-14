import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id: string;
    role: string;
  }; // Убедитесь, что это соответствует структуре свойства `user` в вашем `authMiddleware`
}
