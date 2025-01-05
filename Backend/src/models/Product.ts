import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  category: Types.ObjectId; // Ссылка на категорию
  image?: string; // Общее изображение
  offers: Array<{
    seller: Types.ObjectId; // Ссылка на продавца
    price: number; // Цена товара
    stock: number; // Количество на складе
    description?: string; // Индивидуальное описание продавца
    image?: string; // Индивидуальное изображение продавца
    customFields?: Record<string, any>; // Дополнительные данные предложения
  }>;
  status: "active" | "inactive" | "archived" | "out of stock"; // Статус товара
  attributes?: Record<string, string>; // Дополнительные характеристики товара
  discount?: {
    percentage: number; // Процент скидки
    startDate: Date; // Дата начала скидки
    endDate: Date; // Дата окончания скидки
  };
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true }, // Ссылка на категорию
    image: {
      type: String,
      validate: {
        validator: (v: string) => /^(https?:\/\/.*\.(?:png|jpg|jpeg|svg))$/.test(v),
        message: "Invalid image URL format.",
      },
    },
    offers: [
      {
        _id: false, // Убираем автоматическое создание _id для элементов массива offers
        seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        description: { type: String },
        image: { type: String }, // Индивидуальное изображение продавца
        customFields: { type: Schema.Types.Mixed, default: {} }, // Поле для произвольных данных
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "archived", "out of stock"],
      default: "active",
      index: true,
    },
    attributes: { type: Map, of: String },
    discount: {
      percentage: { type: Number, default: 0 },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.discount?.endDate && new Date() > this.discount.endDate) {
    this.status = "inactive";
  } else if (this.offers.length === 0) {
    this.status = "out of stock";
  } else {
    this.status = "active"; // Устанавливаем статус "active", если есть хотя бы одно предложение
  }
  next();
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
