import { Request, Response, NextFunction } from "express";
import * as adminService from "../../services/admin/adminService";
import CustomError from "../../utils/errorHandler";

// Универсальная функция для ответа
const sendResponse = (res: Response, message: string, data: any) => {
  res.status(200).json({
    status: "success",
    message,
    data,
  });
};

// 1. Получение текущего администратора
export const getCurrentAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await adminService.getCurrentAdmin(req.user?.id!);
    sendResponse(res, "Данные администратора успешно получены", admin);
  } catch (error) {
    next(error);
  }
};

// 2. Обновление текущего администратора
export const updateCurrentAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedAdmin = await adminService.updateCurrentAdmin(req.user?.id!, req.body);
    sendResponse(res, "Данные администратора успешно обновлены", updatedAdmin);
  } catch (error) {
    next(error);
  }
};

// 3. Получение всех администраторов
export const getAllAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role, isActive, page, limit } = req.query as any;
    const admins = await adminService.getAllAdmins({ role, isActive, page: Number(page), limit: Number(limit) });
    sendResponse(res, "Список администраторов успешно получен", admins);
  } catch (error) {
    next(error);
  }
};

// 4. Просмотр логов действий
export const getAdminLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminId, page = 1, limit = 10 } = req.query as any;
    const logs = await adminService.getAdminLogs(adminId, Number(page), Number(limit));
    sendResponse(res, "Логи администраторов успешно получены", logs);
  } catch (error) {
    next(error);
  }
};

// 5. Деактивация/активация администратора
export const toggleAdminStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const updatedAdmin = await adminService.toggleAdminStatus(id, isActive, req.user?.id!);
    sendResponse(res, `Администратор успешно ${isActive ? "активирован" : "деактивирован"}`, updatedAdmin);
  } catch (error) {
    next(error);
  }
};
