import { Request, Response, NextFunction } from "express";
import { Order } from "../../models/Order";
import { CustomError } from "../../middleware/errorMiddleware";

export const getSellerOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Проверяем, что у запроса есть информация о продавце
    if (!req.user || req.user.role !== "seller") {
      throw new CustomError("Access denied. Only sellers can access this endpoint.", 403);
    }

    const sellerId = req.user.id;

    // Ищем заказы, где продавец участвует
    const orders = await Order.find({ "items.seller": sellerId }).populate({
      path: "items.product",
      select: "name image category",
    });

    if (!orders.length) {
      throw new CustomError("No orders found for this seller.", 404);
    }

    res.status(200).json({
      message: "Orders fetched successfully.",
      orders,
    });
  } catch (error) {
    next(error);
  }
};
