import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: string;
  image?: string; // Добавлено поле для URL изображения
  offers: Array<{
    seller: mongoose.Types.ObjectId; // Ссылка на продавца
    price: number;
    stock: number;
  }>;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    image: { type: String }, // Добавлено поле для URL изображения
    offers: [
      {
        seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', productSchema);
