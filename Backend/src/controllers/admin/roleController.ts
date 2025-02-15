import { Request, Response, NextFunction } from "express";
import { Role } from "../../models/Role";
import CustomError from "../../../../errorHandler";

/**
 * Middleware для проверки роли пользователя
 * @param allowedRoles Список ролей, которые имеют доступ
 */
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new CustomError(
        "Доступ запрещен. У вас недостаточно прав для выполнения этого действия.",
        403
      );
    }
    next();
  };
};

export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, permissions, description } = req.body;

    if (!name || name.length < 3) {
      throw new CustomError("Имя роли должно содержать минимум 3 символа", 400);
    }

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      throw new CustomError("Роль с таким именем уже существует", 400);
    }

    const newRole = await Role.create({ name, permissions, description });
    res.status(201).json({ message: "Роль успешно создана", data: newRole });
  } catch (error) {
    next(error);
  }
};

export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.status(200).json({ message: "Список ролей успешно получен", data: roles });
  } catch (error) {
    next(error);
  }
};

export const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id).populate("permissions");

    if (!role) {
      throw new CustomError("Роль не найдена", 404);
    }

    res.status(200).json({ message: "Роль успешно получена", data: role });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, permissions, description } = req.body;

    const updatedRole = await Role.findOneAndUpdate(
      { _id: id },
      { name, permissions, description },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedRole) {
      throw new CustomError("Роль не найдена", 404);
    }

    res.status(200).json({ message: "Роль успешно обновлена", data: updatedRole });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      throw new CustomError("Роль не найдена", 404);
    }

    res.status(200).json({ message: "Роль успешно удалена", data: deletedRole });
  } catch (error) {
    next(error);
  }
};
