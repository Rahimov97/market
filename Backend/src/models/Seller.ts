import mongoose, { Schema, Document } from 'mongoose';

export interface ISeller extends Document {
  name: string;
  rating: number;
  location: string;
}

const sellerSchema = new Schema<ISeller>(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    location: { type: String },
  },
  { timestamps: true }
);

export const Seller = mongoose.model<ISeller>('Seller', sellerSchema);
