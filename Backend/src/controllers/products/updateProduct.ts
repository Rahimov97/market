import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";

const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    const updateData: any = {
      name,
      description,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export default updateProduct;
