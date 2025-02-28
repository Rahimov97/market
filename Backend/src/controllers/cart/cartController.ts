import { Request, Response } from "express";
import mongoose from "mongoose";
import { addToCart, getCart, updateCartItemQuantity, removeCartItem } from "../../services/cart/cartService";

const validateObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

const ensureUserExists = (req: Request, res: Response): string | null => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized: User not found in request." });
    return null;
  }
  return req.user.id;
};

const respondWithError = (res: Response, status: number, message: string, details?: any) => {
  res.status(status).json({ message, ...(details && { details }) });
};

export const addToCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ensureUserExists(req, res);
    if (!userId) return;

    const { productId, quantity, priceAtAddition, sellerId, options } = req.body;

    if (!productId || !sellerId || typeof quantity !== "number") {
      return respondWithError(res, 400, "Missing required fields: productId, sellerId, or quantity.");
    }

    if (!validateObjectId(productId) || !validateObjectId(sellerId)) {
      return respondWithError(res, 400, "Invalid product ID or seller ID format.");
    }

    const cart = await addToCart(
      userId,
      new mongoose.Types.ObjectId(productId),
      quantity,
      priceAtAddition || 0, 
      new mongoose.Types.ObjectId(sellerId),
      options || new Map() 
    );

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addToCartController:", error);
  }
};


export const getCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ensureUserExists(req, res);
    if (!userId) return;

    const cart = await getCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCartController:", error);
    respondWithError(res, 500, "Error fetching cart", { error });
  }
};

export const updateCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ensureUserExists(req, res);
    if (!userId) return;

    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number") {
      return respondWithError(res, 400, "Missing required fields: productId or quantity.");
    }

    if (!validateObjectId(productId)) {
      return respondWithError(res, 400, `Invalid product ID format: '${productId}'.`);
    }

    if (quantity <= 0) {
      await removeCartItem(userId, productId);
      res.status(200).json({ message: "Item removed from cart" });
      return;
    }

    const updatedCart = await updateCartItemQuantity(userId, productId, quantity);
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error in updateCartController:", error);
  }
};


export const removeFromCartController = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ensureUserExists(req, res);
    if (!userId) return;

    const productId = req.query.productId || req.body.productId;

    if (!validateObjectId(productId as string)) {
      return respondWithError(res, 400, `Invalid product ID format: '${productId}'.`);
    }

    await removeCartItem(userId, productId as string);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error in removeFromCartController:", error);
    respondWithError(res, 500, "Error removing cart item", { error });
  }
};
