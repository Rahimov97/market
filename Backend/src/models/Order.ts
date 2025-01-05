import mongoose, { Schema, Document, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId; // Ссылка на товар
  seller: Types.ObjectId; // Ссылка на продавца
  quantity: number; // Количество
  priceAtPurchase: number; // Цена товара на момент покупки
  discountApplied: number; // Применённая скидка
  subtotal: number; // Подсумма для товара
  options?: Record<string, string>; // Дополнительные параметры (например, цвет, размер)
}

export interface IOrderStatusLog {
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned"; // Статус заказа
  timestamp: Date; // Дата изменения статуса
  updatedBy: "system" | "seller" | "user"; // Кто обновил статус
}

export interface IPaymentDetails {
  method: "card" | "paypal" | "cash_on_delivery"; // Метод оплаты
  transactionId?: string; // ID транзакции, если доступно
  amountPaid: number; // Сумма оплаченная
  paymentDate: Date; // Дата оплаты
}

export interface IShippingDetails {
  address: string; // Адрес доставки
  city: string; // Город доставки
  country: string; // Страна доставки
  postalCode: string; // Почтовый код
  trackingNumber?: string; // Номер отслеживания
  courier?: string; // Курьерская служба
  shippingCost: number; // Стоимость доставки
  estimatedDelivery: Date; // Ожидаемая дата доставки
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // Ссылка на пользователя
  items: IOrderItem[]; // Товары в заказе
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned"; // Статус заказа
  statusLog: IOrderStatusLog[]; // Лог изменения статусов
  totalAmount: number; // Общая стоимость заказа (включая скидки и налоги)
  totalDiscount: number; // Общая скидка
  paymentDetails: IPaymentDetails; // Детали оплаты
  shippingDetails: IShippingDetails; // Детали доставки
  taxAmount: number; // Налоги на заказ
  createdAt: Date; // Дата создания заказа
  updatedAt: Date; // Дата последнего обновления
}

// Схема для товаров в заказе
const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
    discountApplied: { type: Number, default: 0 },
    subtotal: { type: Number, required: true },
    options: { type: Map, of: String },
  },
  { _id: false }
);

// Схема для логов изменения статуса
const orderStatusLogSchema = new Schema<IOrderStatusLog>(
  {
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: String, enum: ["system", "seller", "user"], required: true },
  },
  { _id: false }
);

// Схема для деталей оплаты
const paymentDetailsSchema = new Schema<IPaymentDetails>(
  {
    method: {
      type: String,
      enum: ["card", "paypal", "cash_on_delivery"],
      required: true,
    },
    transactionId: { type: String },
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
  },
  { _id: false }
);

// Схема для деталей доставки
const shippingDetailsSchema = new Schema<IShippingDetails>(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    trackingNumber: { type: String },
    courier: { type: String },
    shippingCost: { type: Number, required: true },
    estimatedDelivery: { type: Date, required: true },
  },
  { _id: false }
);

// Основная схема заказа
const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    statusLog: { type: [orderStatusLogSchema], default: [] },
    totalAmount: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    paymentDetails: { type: paymentDetailsSchema, required: true },
    shippingDetails: { type: shippingDetailsSchema, required: true },
    taxAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
