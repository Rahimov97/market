import { Role } from "../../models/Role";
import { Permission } from "../../models/Permission";
import { Admin } from "../../models/Admin";
import CustomError from "../../../../errorHandler";
import mongoose, { Schema } from "mongoose";

// 1. Создание роли
export const createRole = async (name: string, permissions?: string[], description?: string) => {
  if (!name || name.length < 3) {
    throw new CustomError("Имя роли должно содержать минимум 3 символа", 400);
  }

  // Проверка уникальности имени
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    throw new CustomError("Роль с таким именем уже существует", 400);
  }

  // Проверка существования привилегий
  if (permissions && permissions.length > 0) {
    const validPermissions = await Permission.find({ _id: { $in: permissions } });
    if (validPermissions.length !== permissions.length) {
      throw new CustomError("Некоторые из указанных привилегий не существуют", 400);
    }
  }

  const newRole = await Role.create({ name, permissions, description });
  return newRole;
};

// 2. Получение всех ролей
export const getRoles = async () => {
  const roles = await Role.find().populate("permissions").exec();
  return roles;
};

// 3. Получение роли по ID
export const getRoleById = async (id: string) => {
  const role = await Role.findById(id).populate("permissions").exec();
  if (!role) {
    throw new CustomError("Роль не найдена", 404);
  }
  return role;
};

// 4. Обновление роли
export const updateRole = async (
    id: string,
    updates: { name?: string; permissions?: string[]; description?: string }
  ) => {
    const { name, permissions, description } = updates;
  
    const role = await Role.findById(id);
    if (!role) {
      throw new CustomError("Роль не найдена", 404);
    }
  
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        throw new CustomError("Роль с таким именем уже существует", 400);
      }
      role.name = name;
    }
  
    if (permissions) {
      // Преобразование строковых ID в ObjectId
      const validPermissions = await Permission.find({ _id: { $in: permissions } });
      if (validPermissions.length !== permissions.length) {
        throw new CustomError("Некоторые из указанных привилегий не существуют", 400);
      }
      role.permissions = permissions.map((permId) => permId as unknown as Schema.Types.ObjectId);
    }
  
    if (description !== undefined) {
      role.description = description;
    }
  
    await role.save();
    return role;
  };

// 5. Удаление роли
export const deleteRole = async (id: string) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new CustomError("Роль не найдена", 404);
  }

  const adminCount = await Admin.countDocuments({ role: id });
  if (adminCount > 0) {
    throw new CustomError("Невозможно удалить роль, пока она назначена администраторам", 400);
  }

  await role.deleteOne();
  return { message: "Роль успешно удалена" };
};

// 6. Получение роли с количеством пользователей
export const getRoleWithUserCount = async (id: string) => {
  const role = await Role.findById(id)
    .populate("permissions")
    .populate("userCount") // Виртуальное поле
    .exec();

  if (!role) {
    throw new CustomError("Роль не найдена", 404);
  }

  return role;
};
