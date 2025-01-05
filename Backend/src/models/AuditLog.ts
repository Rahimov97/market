import { Schema, model, Document } from "mongoose";

interface IAuditLog extends Document {
  actor: Schema.Types.ObjectId; // ID администратора или пользователя, который выполнил действие
  actorRole?: Schema.Types.ObjectId; // Роль актера (ссылка на Role)
  action: string; // Тип действия
  resource: string; // Тип ресурса (e.g., "User", "Product", "Permission")
  resourceId?: Schema.Types.ObjectId; // ID ресурса, если применимо
  changes?: Record<string, any>; // Детали изменений
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "Admin", // Или "User", в зависимости от вашей системы
      required: true,
    },
    actorRole: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE",
        "READ",
        "UPDATE",
        "DELETE",
        "ASSIGN_ROLE",
        "CHANGE_PERMISSIONS",
        "LOGIN",
        "LOGOUT",
      ],
    },
    resource: {
      type: String,
      required: true,
      enum: ["User", "Product", "Permission", "Role", "Order", "AuditLog"],
    },
    resourceId: {
      type: Schema.Types.ObjectId,
    },
    changes: {
      type: Schema.Types.Mixed, // Более универсальный тип для хранения любых данных
      default: null,
    },
  },
  {
    timestamps: true, // createdAt и updatedAt добавляются автоматически
  }
);

export const AuditLog = model<IAuditLog>("AuditLog", AuditLogSchema);
