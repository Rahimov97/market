import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// Интерфейсы
export interface IReview {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface IWarehouse {
  address: string;
  city: string;
  country: string;
  stock: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
}

export interface ISellerAnalytics {
  totalSales: number;
  totalOrders: number;
  totalProductsSold: number;
  views: number;
  lastActive: Date;
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
}

export interface ISeller extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string; // Для авторизации
  phone?: string;
  logo?: string;
  banner?: string;
  rating: number;
  reviews: IReview[];
  location: {
    city: string;
    country: string;
  };
  verified: boolean;
  warehouses: IWarehouse[];
  shippingRates: {
    country: string;
    cost: number;
  }[];
  analytics: ISellerAnalytics;
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateAnalytics(sales: number, productsSold: number): Promise<void>;
}

// Схема отзывов
const reviewSchema = new Schema<IReview>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Схема складов
const warehouseSchema = new Schema<IWarehouse>(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    stock: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 0 },
      },
    ],
  },
  { _id: false }
);

// Схема аналитики
const sellerAnalyticsSchema = new Schema<ISellerAnalytics>(
  {
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalProductsSold: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    revenueByMonth: [
      {
        month: { type: String, required: true },
        revenue: { type: Number, default: 0 },
      },
    ],
  },
  { _id: false }
);

// Основная схема продавца
const sellerSchema = new Schema<ISeller>(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: { type: String, required: true, select: false },
    phone: {
      type: String,
      validate: {
        validator: (v: string) => /^\+?[1-9]\d{1,14}$/.test(v), // E.164 формат
        message: "Invalid phone number.",
      },
    },
    logo: {
      type: String,
      validate: {
        validator: (v: string) => /^(https?:\/\/.*\.(?:png|jpg|jpeg|svg))$/.test(v), // Формат изображения
        message: "Invalid logo URL.",
      },
    },
    banner: {
      type: String,
      validate: {
        validator: (v: string) => /^(https?:\/\/.*\.(?:png|jpg|jpeg|svg))$/.test(v), // Формат изображения
        message: "Invalid banner URL.",
      },
    },
    rating: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
    location: {
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    verified: { type: Boolean, default: false },
    warehouses: { type: [warehouseSchema], default: [] },
    shippingRates: {
      type: [
        {
          country: { type: String, required: true },
          cost: { type: Number, required: true },
        },
      ],
      default: [],
    },
    analytics: {
      type: sellerAnalyticsSchema,
      default: {
        totalSales: 0,
        totalOrders: 0,
        totalProductsSold: 0,
        views: 0,
        revenueByMonth: [],
      },
    },
  },
  { timestamps: true }
);

// Middleware для хэширования пароля
sellerSchema.pre("save", async function (next) {
  // Убедитесь, что пароль был изменен, перед хэшированием
  if (!this.isModified("password")) {
    console.log("Password was not modified, skipping hashing.");
    return next();
  }

  // Если пароль был изменен или создается новый документ, хэшируем его
  console.log("Password before hashing:", this.password);
  this.password = await bcrypt.hash(this.password, 10);
  console.log("Password after hashing:", this.password);
  next();
});


// Метод для сравнения паролей
sellerSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  console.log("Password from request:", candidatePassword);
  console.log("Hashed password from DB:", this.password);

  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log("Passwords match:", isMatch);
  return isMatch;
};



// Метод для обновления аналитики
sellerSchema.methods.updateAnalytics = async function (sales: number, productsSold: number) {
  this.analytics.totalSales += sales;
  this.analytics.totalProductsSold += productsSold;
  this.analytics.lastActive = new Date();
  await this.save();
};

export const Seller = mongoose.model<ISeller>("Seller", sellerSchema);
