import { Request, Response, NextFunction } from 'express';
import { Product } from '../../models/Product';

const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, category, price, sellerId, stock } = req.body;

    if (!name || !category) {
      res.status(400);
      throw new Error('Name and category are required.');
    }

    const newProductData: any = {
      name,
      description,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      offers: [],
    };

    if (sellerId && price) {
      newProductData.offers.push({ seller: sellerId, price: parseFloat(price), stock: stock || 0 });
    }

    const newProduct = new Product(newProductData);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

export default createProduct;
