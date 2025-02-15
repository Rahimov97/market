import { Request, Response, NextFunction } from "express";
import { Admin } from "../models/Admin";
import { Role } from "../models/Role";
import { Permission } from "../models/Permission";
import CustomError from "../utils/errorHandler";
import mongoose from "mongoose";

interface PermissionCheckOptions {
  requiredPermissions?: string[];
  allowedRoles?: string[];
}

export const roleMiddleware = (options: PermissionCheckOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requiredPermissions = [], allowedRoles = [] } = options;

      if (!req.user || !req.user.id) {
        console.warn("[roleMiddleware] Авторизация не выполнена: пользователь отсутствует.");
        throw new CustomError("Пользователь не авторизован", 401);
      }

      console.info(`[roleMiddleware] Проверка доступа для пользователя с ID: ${req.user.id}`);

      // Проверка администратора
      const admin = await Admin.findOne({ user: req.user.id }).populate("role permissions");
      if (!admin) {
        console.warn("[roleMiddleware] Пользователь не является администратором.");
        throw new CustomError("Пользователь не имеет административных прав", 403);
      }

      console.info(`[roleMiddleware] Найден администратор с ролью ID: ${admin.role}`);

      // Проверка роли
      if (allowedRoles.length > 0) {
        if (!mongoose.isValidObjectId(admin.role)) {
          console.error("[roleMiddleware] Некорректный идентификатор роли.");
          throw new CustomError("Некорректный идентификатор роли", 400);
        }

        const role = await Role.findById(admin.role).populate("permissions");
        if (!role || !allowedRoles.some((r) => r.toLowerCase() === role.name.toLowerCase())) {
          console.warn(
            `[roleMiddleware] Роль "${role?.name}" не разрешена. Требуемые роли: ${allowedRoles.join(", ")}.`
          );
          throw new CustomError("Недостаточно прав для выполнения действия", 403);
        }

        console.info(`[roleMiddleware] Роль "${role.name}" разрешена.`);
      }

      // Проверка привилегий
      if (requiredPermissions.length > 0) {
        const [rolePermissions, adminPermissions] = await Promise.all([
          Permission.find({
            _id: { $in: (await Role.findById(admin.role).select("permissions"))?.permissions || [] },
          }).lean(),
          Permission.find({ _id: { $in: admin.permissions || [] } }).lean(),
        ]);

        const effectivePermissions = new Set([
          ...rolePermissions.map((perm) => perm.name),
          ...adminPermissions.map((perm) => perm.name),
        ]);

        console.info(`[roleMiddleware] Эффективные привилегии: ${[...effectivePermissions].join(", ")}`);

        const missingPermissions = requiredPermissions.filter(
          (permission) => !effectivePermissions.has(permission)
        );

        if (missingPermissions.length > 0) {
          console.warn(`[roleMiddleware] Отсутствующие привилегии: ${missingPermissions.join(", ")}`);
          throw new CustomError("Недостаточно привилегий для выполнения действия", 403);
        }

        console.info("[roleMiddleware] Все необходимые привилегии предоставлены.");
      }

      console.info(`[roleMiddleware] Доступ разрешен для пользователя ID: ${req.user.id}`);
      next();
    } catch (error) {
      console.error("[roleMiddleware] Ошибка проверки доступа:", error);
      next(error instanceof CustomError ? error : new CustomError("Ошибка проверки доступа", 500));
    }
  };
};
