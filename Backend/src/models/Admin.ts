import { Schema, model, Document, Types } from "mongoose";

interface IAdmin extends Document {
  user: Types.ObjectId; // Ссылка на пользователя
  role: Types.ObjectId; // Ссылка на роль
  permissions?: Types.ObjectId[]; // Уникальные привилегии (если нужны)
  isActive: boolean; // Флаг активности
  createdAt?: Date;
  updatedAt?: Date;
  effectivePermissions?: Types.ObjectId[]; // Виртуальное поле для всех привилегий
}

interface IRole {
  permissions: Types.ObjectId[];
}

const AdminSchema = new Schema<IAdmin>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission", // Дополнительные привилегии
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Логирование данных при сохранении администратора
AdminSchema.pre("save", function (next) {
  console.log(`[AdminSchema] Перед сохранением администратора: ${this}`);
  next();
});

// Виртуальное поле для эффективных привилегий
AdminSchema.virtual("effectivePermissions").get(function () {
  console.log(`[AdminSchema] Виртуальное поле effectivePermissions - Роль: ${this.role}`);
  return this.permissions;
});

// Метод для получения всех привилегий администратора, включая привилегии роли
AdminSchema.methods.getEffectivePermissions = async function (): Promise<Types.ObjectId[]> {
  try {
    const role = (await model("Role")
      .findById(this.role)
      .populate<{ permissions: Types.ObjectId[] }>("permissions")
      .lean()) as IRole | null;

    const rolePermissions = role?.permissions || [];
    const combinedPermissions = [...rolePermissions, ...(this.permissions || [])];
    console.log(`[AdminSchema] Полный список привилегий: ${combinedPermissions}`);
    return combinedPermissions;
  } catch (error) {
    if (error instanceof Error) {
      // Обработка ошибки с типом Error
      console.error(`[AdminSchema] Ошибка при получении привилегий: ${error.message}`);
    } else {
      // Обработка неизвестного типа ошибки
      console.error(`[AdminSchema] Неизвестная ошибка при получении привилегий:`, error);
    }
    return [];
  }
};

export const Admin = model<IAdmin>("Admin", AdminSchema);
