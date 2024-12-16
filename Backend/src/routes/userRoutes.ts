import express from "express";
import { getProfile, updateProfile } from "../controllers/users/profileController";
import authMiddleware from "../middleware/authMiddleware";
import upload from "../middleware/uploadMiddleware";

const router = express.Router();

// Получение профиля
router.get("/profile", authMiddleware, getProfile);

// Обновление профиля (с поддержкой загрузки аватара)
router.put("/profile", authMiddleware, upload.single("avatar"), updateProfile);

export default router;