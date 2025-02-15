import { Admin } from "../../models/Admin";
import { Role } from "../../models/Role";
import { AuditLog } from "../../models/AuditLog";
import CustomError from "../../utils/errorHandler";
import { Types } from "mongoose";

// Типизация параметров фильтрации
interface AdminFilterParams {
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// Централизованная функция логирования
const logAdminAction = async (
  actor: string,
  action: string,
  resource: string,
  resourceId?: string,
  changes?: any
) => {
  await AuditLog.create({
    actor: new Types.ObjectId(actor),
    action,
    resource,
    resourceId: resourceId ? new Types.ObjectId(resourceId) : undefined,
    changes,
  });
};

// 1. Создание администратора
export const createAdmin = async (data: any, actorId: string) => {
  const { user, role, permissions, isActive } = data;

  if (!user || !role) {
    throw new CustomError("Поля 'user' и 'role' обязательны", 400);
  }

  const roleExists = await Role.findById(role);
  if (!roleExists) {
    throw new CustomError("Указанная роль не существует", 404);
  }

  const existingAdmin = await Admin.findOne({ user });
  if (existingAdmin) {
    throw new CustomError("Пользователь уже является администратором", 400);
  }

  const newAdmin = await Admin.create({ user, role, permissions, isActive });

  await logAdminAction(actorId, "CREATE", "Admin", newAdmin.id, { role, permissions });

  return newAdmin;
};

// 2. Получение текущего администратора
export const getCurrentAdmin = async (userId: string) => {
  const admin = await Admin.findOne({ user: userId }).populate("role permissions");
  if (!admin) {
    throw new CustomError("Администратор не найден", 404);
  }
  return admin;
};

// 3. Обновление текущего администратора
export const updateCurrentAdmin = async (
  userId: string,
  updateData: { permissions?: string[]; isActive?: boolean }
) => {
  const updatedAdmin = await Admin.findOneAndUpdate(
    { user: userId },
    updateData,
    { new: true, runValidators: true }
  ).populate("role permissions");

  if (!updatedAdmin) {
    throw new CustomError("Администратор не найден", 404);
  }

  return updatedAdmin;
};

// 4. Получение всех администраторов
export const getAllAdmins = async (filterParams: AdminFilterParams) => {
  const { role, isActive, page = 1, limit = 10 } = filterParams;

  const filter: any = {};
  if (role) filter.role = new Types.ObjectId(role);
  if (typeof isActive !== "undefined") filter.isActive = isActive;

  const admins = await Admin.find(filter)
    .populate("user role permissions")
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();

  const total = await Admin.countDocuments(filter);

  return { admins, total, page, limit };
};

// 5. Получение логов действий администратора
export const getAdminLogs = async (adminId: string, page = 1, limit = 10) => {
  const logs = await AuditLog.find({ actor: adminId })
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await AuditLog.countDocuments({ actor: adminId });

  return { logs, total, page, limit };
};

// 6. Обновление администратора
export const updateAdmin = async (id: string, data: any, actorId: string) => {
  const { role, permissions, isActive } = data;

  if (role) {
    const roleExists = await Role.findById(role);
    if (!roleExists) {
      throw new CustomError("Указанная роль не существует", 404);
    }
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
    id,
    { role, permissions, isActive },
    { new: true, runValidators: true }
  ).populate("role permissions");

  if (!updatedAdmin) {
    throw new CustomError("Администратор не найден", 404);
  }

  await logAdminAction(actorId, "UPDATE", "Admin", id, { role, permissions, isActive });

  return updatedAdmin;
};

// 7. Активация/деактивация администратора
export const toggleAdminStatus = async (id: string, isActive: boolean, actorId: string) => {
  const updatedAdmin = await Admin.findByIdAndUpdate(
    id,
    { isActive },
    { new: true, runValidators: true }
  ).populate("role permissions");

  if (!updatedAdmin) {
    throw new CustomError("Администратор не найден", 404);
  }

  await logAdminAction(actorId, "TOGGLE_STATUS", "Admin", id, { isActive });

  return updatedAdmin;
};

// 8. Удаление администратора
export const deleteAdmin = async (id: string, actorId: string) => {
  const deletedAdmin = await Admin.findByIdAndDelete(id);
  if (!deletedAdmin) {
    throw new CustomError("Администратор не найден", 404);
  }

  await logAdminAction(actorId, "DELETE", "Admin", id);

  return { message: "Администратор успешно удалён" };
};
