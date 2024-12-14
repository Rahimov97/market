import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";

const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export default getProductById;
