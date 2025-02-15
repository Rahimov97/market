import { Order, IOrder } from "../../models/Order";
import { Product } from "../../models/Product";
import CustomError from "../../utils/errorHandler";
import { Types } from "mongoose";

// Типизация для фильтров заказа
interface OrderFilterParams {
  status?: string;
  userId?: string;
  sellerId?: string;
  startDate?: string;
  endDate?: string;
}

// Вспомогательная функция для фильтрации заказов по датам
const buildDateFilter = (startDate?: string, endDate?: string) => {
  const dateFilter: any = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);
  return dateFilter;
};

// 1. Создание заказа
export const createOrder = async (data: any): Promise<IOrder> => {
  const { user, items, shippingDetails, paymentDetails, totalAmount } = data;

  if (!user || !items || items.length === 0 || !shippingDetails || !paymentDetails || !totalAmount) {
    throw new CustomError("Все поля обязательны для создания заказа", 400);
  }

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new CustomError(`Товар с ID ${item.product} не найден`, 404);

    const offer = product.offers.find((o) => o.seller.toString() === item.seller);
    if (!offer) throw new CustomError(`Предложение от продавца ${item.seller} не найдено`, 404);

    if (offer.stock < item.quantity) {
      throw new CustomError(`Недостаточно товара с ID ${item.product} на складе`, 400);
    }

    offer.stock -= item.quantity;
    await product.save();
  }

  return await Order.create(data);
};

// 2. Получение списка заказов с фильтрацией и пагинацией
export const getOrders = async (filterParams: OrderFilterParams, page = 1, limit = 10) => {
  const filter: any = {};

  if (filterParams.status) filter.status = filterParams.status;
  if (filterParams.userId) filter.user = new Types.ObjectId(filterParams.userId);
  if (filterParams.startDate || filterParams.endDate) {
    filter.createdAt = buildDateFilter(filterParams.startDate, filterParams.endDate);
  }

  const orders = await Order.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user items.product")
    .sort({ createdAt: -1 });

  const total = await Order.countDocuments(filter);

  return { orders, total, page, limit };
};

// 3. Получение заказа по ID
export const getOrderById = async (id: string) => {
  const order = await Order.findById(id).populate("user items.product");
  if (!order) throw new CustomError("Заказ не найден", 404);
  return order;
};

// 4. Обновление статуса заказа
export const updateOrderStatus = async (
    orderId: string,
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned",
    updatedBy: "user" | "seller" | "system"
  ) => {
    const validStatuses: Array<"pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned"> = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];
  
    if (!validStatuses.includes(status)) {
      throw new CustomError("Недопустимый статус заказа", 400);
    }
  
    const order = await Order.findById(orderId);
    if (!order) {
      throw new CustomError("Заказ не найден", 404);
    }
  
    order.status = status;
    order.statusLog.push({ status, timestamp: new Date(), updatedBy });
    await order.save();
  
    return order;
  };
  

// 5. Удаление заказа
export const deleteOrder = async (orderId: string) => {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      throw new CustomError("Заказ не найден", 404);
    }
  
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        const offer = product.offers.find((o) => o.seller.equals(item.seller));
        if (offer) {
          offer.stock += item.quantity;
          await product.save();
        }
      }
    }
  
    return { message: "Заказ успешно удалён" };
  };
  
// Добавление записи в лог статусов
export const addOrderStatusLog = async (
  orderId: string,
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned",
  updatedBy: "user" | "seller" | "system"
) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new CustomError("Заказ не найден", 404);
  }

  // Добавляем запись в лог статусов
  order.statusLog.push({ status, timestamp: new Date(), updatedBy });
  await order.save();

  return order;
};