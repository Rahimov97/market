import express from "express";
import { registerSeller, loginSeller, checkSellerAuth } from "../controllers/sellers/sellerAuthController";
import authMiddleware from "../middleware/authMiddleware";
import { roleMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Роуты авторизации продавцов
router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.get("/auth-check", authMiddleware, roleMiddleware("seller"), checkSellerAuth);

export default router;
