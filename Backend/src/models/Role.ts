import { Schema, model, Document } from "mongoose";

interface IRole extends Document {
  name: string; // Название роли (например, 'admin', 'manager')
  permissions: Schema.Types.ObjectId[]; // Список привилегий
  description?: string; // Описание роли
  createdAt?: Date;
  updatedAt?: Date;
  userCount?: number; // Подсчет пользователей с этой ролью
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      index: true, // Добавлен индекс для быстрого поиска
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
        default: [], // Позволяет создать роль без привилегий
      },
    ],
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200, // Ограничение длины описания
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Включаем виртуальные поля
    toObject: { virtuals: true },
  }
);

// Виртуальное поле для подсчета пользователей
RoleSchema.virtual("userCount", {
  ref: "Admin", // Ссылка на модель Admin
  localField: "_id",
  foreignField: "role",
  count: true, // Возвращает количество вместо массива
});

// Хук для удаления привилегий, связанных с ролью
RoleSchema.pre<IRole>("deleteOne", { document: true, query: false }, async function (next: () => void) {
  const roleId = this._id;
  const Permission = model("Permission");
  await Permission.updateMany({ role: roleId }, { $pull: { role: roleId } });
  next();
});

export const Role = model<IRole>("Role", RoleSchema);
