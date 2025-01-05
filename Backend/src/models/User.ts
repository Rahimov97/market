import mongoose, { Schema, Document, ObjectId } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: ObjectId;
  __v?: number;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  password?: string;
  role: Schema.Types.ObjectId;  // Ссылка на модель Role
  avatar?: string;
  gender?: "male" | "female" | "other";
  birthDate?: Date;
  addresses?: Array<{
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode: string;
    isDefault?: boolean;
  }>;
  favoriteProducts?: ObjectId[];
  cart?: ObjectId;
  orderHistory?: ObjectId[];
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v),
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      validate: {
        validator: (v: string) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ),
        message: (props: any) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      validate: {
        validator: (v: string) => !v || v.length >= 6,
        message: () => "Password must be at least 6 characters long.",
      },
    },
    role: {
      type: Schema.Types.ObjectId,  // Ссылка на модель Role
      ref: "Role",  // Название модели, на которую ссылается
      required: true,  // Роль обязательна
    },
    avatar: {
      type: String,
      default: "https://example.com/default-avatar.png",
    },
    gender: { type: String, enum: ["male", "female", "other"] },
    birthDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          return value <= new Date();
        },
        message: "Birth date cannot be in the future.",
      },
    },
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String },
        country: { type: String, required: true },
        zipCode: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],
    favoriteProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

// Преобразование объекта в JSON
userSchema.method("toJSON", function () {
  const user = this.toObject() as IUser;
  const { _id, __v, password, ...rest } = user;
  return { ...rest, id: _id.toString() };
});

// Метод для сравнения пароля
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as IUser;
  if (!user.password) return false;
  return bcrypt.compare(candidatePassword, user.password);
};

// Хук для хеширования пароля перед сохранением
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  if (!user.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password as string, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User = mongoose.model<IUser>("User", userSchema);
