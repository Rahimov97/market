import { Request, Response, NextFunction } from "express";
import { AuditLog } from "../../models/AuditLog";
import * as orderService from "../../services/admin/orderService";
import { IOrder } from "../../models/Order";

// Универсальная функция для ответа
const sendResponse = (res: Response, message: string, data: any) => {
  res.status(200).json({
    status: "success",
    message,
    data,
  });
};

// Централизованная функция логирования
const logAction = async (
  actor: string,
  action: string,
  resource: string,
  resourceId?: string,
  changes?: Record<string, any>
) => {
  await AuditLog.create({
    actor,
    action,
    resource,
    resourceId,
    changes,
  });
};

// 1. Получение всех заказов
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, userId, sellerId, page = 1, limit = 10 } = req.query as any;
    const orders = await orderService.getOrders(
      { status, userId, sellerId }, // Добавлен sellerId в параметры фильтрации
      Number(page),
      Number(limit)
    );
    sendResponse(res, "Список заказов успешно получен", orders);
  } catch (error) {
    next(error);
  }
};

// 2. Получение заказа по ID
export const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    sendResponse(res, "Данные заказа успешно получены", order);
  } catch (error) {
    next(error);
  }
};

// 3. Создание заказа
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order: IOrder = await orderService.createOrder(req.body);

    // Логируем создание заказа
    await logAction(req.user!.id, "CREATE", "Order", order._id.toString(), req.body);
    sendResponse(res, "Заказ успешно создан", order);
  } catch (error) {
    next(error);
  }
};

// 4. Обновление статуса заказа
export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedBy: "user" | "seller" | "system" =
      req.user?.role === "user" || req.user?.role === "seller" ? req.user.role : "system";

    const updatedOrder = await orderService.updateOrderStatus(id, status, updatedBy);

    // Логируем обновление статуса
    await logAction(req.user!.id, "UPDATE", "Order", id, { status });

    sendResponse(res, "Статус заказа успешно обновлён", updatedOrder);
  } catch (error) {
    next(error);
  }
};

// 5. Удаление заказа
export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const result = await orderService.deleteOrder(id);

    // Логируем удаление заказа
    await logAction(req.user!.id, "DELETE", "Order", id);

    sendResponse(res, "Заказ успешно удалён", result);
  } catch (error) {
    next(error);
  }
};

// 6. Добавление записи в лог статуса заказа
export const addOrderStatusLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, updatedBy } = req.body;

    // Проверяем, что статус валиден
    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        status: "error",
        message: "Неверный статус заказа.",
      });
      return;
    }

    // Проверяем, кто обновляет статус
    const validatedUpdatedBy: "user" | "seller" | "system" =
      updatedBy === "user" || updatedBy === "seller" || updatedBy === "system" ? updatedBy : "system";

    // Обновляем лог статусов в сервисе
    const updatedOrder = await orderService.addOrderStatusLog(id, status, validatedUpdatedBy);

    // Логируем добавление записи
    await logAction(req.user!.id, "ADD_STATUS_LOG", "Order", id, { status, updatedBy });

    sendResponse(res, "Лог статуса успешно добавлен", updatedOrder);
  } catch (error) {
    next(error);
  }
};
