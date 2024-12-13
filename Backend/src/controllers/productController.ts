import mongoose from 'mongoose';
import { Request, Response, NextFunction  } from 'express';
import { Product } from '../models/Product';
import { Seller } from '../models/Seller';

export const addSellerToProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params; // ID товара
      const { sellerId, price, stock } = req.body;
  
      if (!sellerId || !price) {
        res.status(400);
        throw new Error('Seller ID and price are required.');
      }
  
      if (!mongoose.Types.ObjectId.isValid(sellerId) || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid seller or product ID format.');
      }
  
      // Выполняем агрегацию
      const aggregationResult = await Product.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } }, // Ищем товар по ID
        {
          $lookup: {
            from: 'sellers', // Коллекция продавцов
            localField: 'offers.seller',
            foreignField: '_id',
            as: 'existingSellers', // Поле для найденных продавцов
          },
        },
      ]);
  
      if (aggregationResult.length === 0) {
        res.status(404);
        throw new Error('Product not found.');
      }
  
      const product = aggregationResult[0];
  
      // Проверяем, существует ли продавец
      const sellerExists = await Seller.findById(sellerId);
      if (!sellerExists) {
        res.status(404);
        throw new Error('Seller not found.');
      }
  
      // Добавляем продавца к товару
      const productDocument = await Product.findById(id);
      if (!productDocument) {
        res.status(404);
        throw new Error('Product not found.');
      }
  
      productDocument.offers.push({ seller: sellerId, price, stock });
      const updatedProduct = await productDocument.save();
  
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };

// Получить все товары
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { category: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const products = await Product.find(query).populate('offers.seller', 'name rating location');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Получить товар по ID
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (!product) {
        res.status(404);
        throw new Error('Product not found');
      }
  
      res.json(product);
    } catch (error) {
      next(error); // Передаём ошибку в централизованный обработчик
    }
  };
  
  // Создать новый товар
  export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
  
      // Добавляем в `offers` только если `sellerId` и `price` присутствуют
      if (sellerId && price) {
        newProductData.offers.push({ seller: sellerId, price: parseFloat(price), stock: stock || 0 });
      } else {
        delete newProductData.offers; // Удаляем пустой массив
      }
  
      const newProduct = new Product(newProductData);
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      next(error);
    }
  };
  
  export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, category } = req.body;
  
      const updateData: any = { name, description, category };
  
      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  
      if (!updatedProduct) {
        res.status(404);
        throw new Error('Product not found.');
      }
  
      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  };
  
// Удалить товар
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Добавить предложение к товару
export const addOfferToProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params; // ID товара
    const { sellerId, price, stock } = req.body;

    if (!sellerId || !price) {
      res.status(400).json({ message: 'Seller ID and price are required.' });
      return;
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Добавляем предложение к товару
    product.offers.push({ seller: sellerId, price, stock });
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
