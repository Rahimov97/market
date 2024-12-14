import { DecodedToken } from "../../src/middleware/authMiddleware"; // Убедитесь, что путь корректный

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken; // Расширяем интерфейс Request
    }
  }
}
