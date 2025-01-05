import { Request, Response, NextFunction } from "express";
import { Admin } from "../models/Admin";
import { Permission } from "../models/Permission";
import CustomError from "../utils/errorHandler";

/**
 * Middleware для проверки разрешений.
 * @param requiredPermissions - Список разрешений, которые пользователь должен иметь для выполнения действия.
 */
export const permissionMiddleware = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`[Middleware Привилегии] Начало проверки для пользователя: ${req.user?.id}`);

      // Проверка авторизации
      if (!req.user || !req.user.id) {
        console.warn(`[Middleware Привилегии] Пользователь не авторизован или отсутствует ID.`);
        throw new CustomError("Пользователь не авторизован", 401);
      }

      // Получение администратора
      const admin = await Admin.findOne({ user: req.user.id }).populate("role permissions");
      if (!admin) {
        console.warn(`[Middleware Привилегии] Администратор не найден для пользователя с ID: ${req.user.id}`);
        throw new CustomError("Администратор не найден", 403);
      }

      console.log(`[Middleware Привилегии] Найден администратор: ${admin._id}, Роль: ${admin.role}`);

      // Получение привилегий
      const rolePermissions = await Permission.find({
        _id: { $in: admin.role ? [admin.role] : [] },
      }).lean();

      const adminPermissions = await Permission.find({
        _id: { $in: admin.permissions || [] },
      }).lean();

      const effectivePermissions = new Set([
        ...rolePermissions.map((perm) => perm.name),
        ...adminPermissions.map((perm) => perm.name),
      ]);

      console.log(`[Middleware Привилегии] Эффективные привилегии: ${[...effectivePermissions].join(", ")}`);

      // Проверка наличия всех требуемых привилегий
      const missingPermissions = requiredPermissions.filter(
        (permission) => !effectivePermissions.has(permission)
      );

      if (missingPermissions.length > 0) {
        console.warn(
          `[Middleware Привилегии] Недостаточно привилегий. Отсутствуют: ${missingPermissions.join(", ")}`
        );
        throw new CustomError("Недостаточно привилегий для выполнения действия", 403);
      }

      console.log(`[Middleware Привилегии] Проверка привилегий успешно пройдена для пользователя: ${req.user.id}`);
      next();
    } catch (error) {
      console.error("[Middleware Привилегии] Ошибка:", error);
      next(error instanceof CustomError ? error : new CustomError("Ошибка проверки привилегий", 500));
    }
  };
};
