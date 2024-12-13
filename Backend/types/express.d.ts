import { IUser } from '../src/models/User'; // Убедитесь, что путь правильный

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
