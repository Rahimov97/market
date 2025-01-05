import mongoose, { Schema, Document, CallbackError } from "mongoose";
import { slugify } from "../utils/slugify";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: string;
  parentCategory?: mongoose.Types.ObjectId; // Ссылка на родительскую категорию
  path?: string;
  level?: number;
  sortOrder: number;
  productCount: number;
  isFeatured: boolean;
  filters?: {
    key: string;
    values: string[];
  }[];
  analytics?: {
    views: number;
    clicks: number;
  };
  slug: string;
  isActive: boolean;
  childCategories?: mongoose.Types.ObjectId[]; // Массив ссылок на дочерние категории
  childCategoriesTree?: ICategory[]; // Виртуальное поле для дерева категорий
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    image: {
      type: String,
      validate: {
        validator: (v: string) => /^(https?:\/\/.*\.(?:png|jpg|jpeg|svg))$/i.test(v),
        message: "Неверный формат URL изображения.",
      },
    },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, // Ссылка на родительскую категорию
    childCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // Массив ссылок на дочерние категории
    path: { type: String },
    level: { type: Number, default: 1 },
    sortOrder: { type: Number, default: 0 },
    productCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    filters: [
      {
        key: { type: String, required: true },
        values: { type: [String], default: [] },
      },
    ],
    analytics: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Виртуальное поле для загрузки дочерних категорий как дерева
categorySchema.virtual("childCategoriesTree", {
  ref: "Category", // Ссылка на ту же коллекцию
  localField: "_id", // Поле, по которому связываются документы
  foreignField: "parentCategory", // Поле, указывающее на родителя
});

// Настройки виртуальных полей для toObject и toJSON
categorySchema.set("toObject", { virtuals: true });
categorySchema.set("toJSON", { virtuals: true });

categorySchema.pre<ICategory>("save", function (next: (err?: CallbackError) => void) {
  if (!this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

categorySchema.pre("deleteOne", { document: true }, async function (next: (err?: CallbackError) => void) {
  if (this.childCategories && this.childCategories.length > 0) {
    return next(new Error("Нельзя удалить категорию, у которой есть дочерние категории."));
  }
  next();
});

categorySchema.index({ slug: 1 });
categorySchema.index({ name: 1 });
categorySchema.index({ parentCategory: 1 });

export const Category = mongoose.model<ICategory>("Category", categorySchema);
