import { Schema, model, Document } from "mongoose";

interface IPermission extends Document {
  name: string; // Уникальное название привилегии
  description?: string; // Описание привилегии
  roles: Schema.Types.ObjectId[]; // Список ролей, которые имеют эту привилегию
  createdAt?: Date;
  updatedAt?: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3, // Минимальная длина имени
      maxlength: 50, // Максимальная длина имени
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200, // Ограничение длины описания
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Role", // Ссылка на модель Role
      },
    ],
  },
  {
    timestamps: true, // Добавляет createdAt и updatedAt
  }
);

// Статический метод: Получение всех привилегий
PermissionSchema.statics.getAllPermissions = async function () {
  return await this.find();
};

// Статический метод: Проверка существования привилегии
PermissionSchema.statics.existsByName = async function (name: string): Promise<boolean> {
  const count = await this.countDocuments({ name });
  return count > 0;
};

export const Permission = model<IPermission>("Permission", PermissionSchema);
