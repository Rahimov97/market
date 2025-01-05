import { Router } from "express";
import {
  addToCartController,
  getCartController,
  updateCartController,
  removeFromCartController,
} from "../controllers/cart/cartController";
import authMiddleware from "../middleware/authMiddleware";

const cartRouter = Router();

// Применяем authMiddleware ко всем маршрутам внутри cartRouter
cartRouter.use(authMiddleware);

cartRouter.post("/add", addToCartController);
cartRouter.get("/", getCartController);
cartRouter.put("/update", updateCartController);
cartRouter.delete("/remove", removeFromCartController);

export default cartRouter;
