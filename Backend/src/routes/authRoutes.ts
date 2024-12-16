import express from "express";
import { registerBuyer, loginBuyer, getProfile } from "../controllers/auth/buyerAuthController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/register", registerBuyer);
router.post("/login", loginBuyer);
router.get("/profile", authMiddleware, getProfile);
router.get("/register", (req, res) => {
    res.status(405).json({ message: "Use POST method to register." });
  });
  

export default router;
