import mongoose, { Schema, Document, Types } from "mongoose";

interface PopulatedProduct {
  _id: string;
  name: string;
  image?: string;
}

interface CartItem {
  _id?: Types.ObjectId; // Уникальный идентификатор для элемента
  productId: Types.ObjectId | PopulatedProduct;
  quantity: number;
  priceAtAddition: number; // Цена на момент добавления
  discount?: number; // Скидка на товар
  sellerId: Types.ObjectId; // Продавец товара
  options?: Map<string, string>; // Выбранные опции (например, цвет, размер)
  subtotal: number; // Подсумма (цена с учётом количества и скидки)
}


export interface CartDocument extends Document {
  userId: Types.ObjectId;
  items: CartItem[];
  status: "active" | "pending" | "paid" | "shipped" | "cancelled";
  totalAmount: number; // Общая сумма корзины
  totalDiscount?: number; // Общая скидка
  additionalServices?: {
    name: string;
    price: number;
  }[];
  coupon?: {
    code: string;
    discountValue: number;
    type: "percentage" | "fixed";
  };
  tax?: {
    percentage: number;
    amount: number;
  };
  changesLog?: {
    action: "add" | "remove" | "update";
    productId: Types.ObjectId;
    timestamp: Date;
    details?: string;
  }[];
  notifications?: {
    type: "stock" | "price";
    message: string;
    timestamp: Date;
  }[];
  expiresAt?: Date;
  isExpired: boolean; // Добавлен булевый флаг для истёкшей корзины
  lastUpdated: Date;
}

const CartItemSchema = new Schema<CartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 },
    priceAtAddition: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    sellerId: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
    options: { type: Map, of: String },
  },
  { _id: false }
);

const CartSchema = new Schema<CartDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [CartItemSchema], default: [] },
    status: {
      type: String,
      enum: ["active", "pending", "paid", "shipped", "cancelled"],
      default: "active",
    },
    totalAmount: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    additionalServices: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    coupon: {
      code: { type: String },
      discountValue: { type: Number },
      type: { type: String, enum: ["percentage", "fixed"] },
    },
    tax: {
      percentage: { type: Number },
      amount: { type: Number },
    },
    changesLog: [
      {
        action: { type: String, enum: ["add", "remove", "update"], required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        timestamp: { type: Date, default: Date.now },
        details: { type: String },
      },
    ],
    notifications: [
      {
        type: { type: String, enum: ["stock", "price"], required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Middleware для предотвращения дублирования товаров
CartSchema.pre("save", function (next) {
  const cart = this;

  // Уникализируем товары в корзине
  const uniqueItems = new Map();
  cart.items.forEach((item) => {
    const key = `${item.productId.toString()}-${item.sellerId.toString()}`;
    if (uniqueItems.has(key)) {
      // Если товар уже есть, увеличиваем количество и пересчитываем общую сумму
      const existingItem = uniqueItems.get(key);
      existingItem.quantity += item.quantity;
    } else {
      uniqueItems.set(key, item);
    }
  });

  cart.items = Array.from(uniqueItems.values());

  // Пересчитываем итоговые суммы
  cart.totalAmount = cart.items.reduce(
    (acc, item) => acc + item.quantity * (item.priceAtAddition - (item.discount || 0)),
    0
  );
  cart.totalDiscount = cart.items.reduce(
    (acc, item) => acc + (item.discount || 0) * item.quantity,
    0
  );

  cart.isExpired = cart.expiresAt ? cart.expiresAt < new Date() : false;
  cart.lastUpdated = new Date();

  next();
});

export const Cart = mongoose.model<CartDocument>("Cart", CartSchema);
