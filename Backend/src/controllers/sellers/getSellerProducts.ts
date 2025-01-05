import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";
import { CustomError } from "../../middleware/errorMiddleware";

export const getSellerProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new CustomError("Unauthorized access.", 401);
    }

    const products = await Product.find({ "offers.seller": sellerId });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
