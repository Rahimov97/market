import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";

const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const products = await Product.find(query).populate("offers.seller", "name rating location");
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export default getProducts;
