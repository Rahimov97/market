import { Request, Response, NextFunction } from "express";
import {
  findProducts,
  findProductById,
  createNewProduct,
  updateExistingProduct,
  deleteProductById,
} from "../../services/products/productService";
import { CustomError } from "../../middleware/errorMiddleware";
import { SortOrder } from "mongoose";
import { Seller } from "../../models/Seller";
import { Product, IProduct } from "../../models/Product";
import mongoose from "mongoose";
import { Category } from "../../models/Category";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, category, description, price, stock, image, attributes } = req.body;

    const sellerId = req.user?.id;
    if (!sellerId) {
      throw new CustomError("Не удалось определить продавца", 400);
    }

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    // Проверка существования категории (по ID или имени)
    const existingCategory = mongoose.isValidObjectId(category)
      ? await Category.findById(category) // Если `category` — ObjectId
      : await Category.findOne({ name: category }); // Если `category` — строка (имя)

    if (!existingCategory) {
      throw new CustomError("Категория не найдена", 404);
    }

    // Парсинг данных
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw new CustomError("Цена должна быть положительным числом", 400);
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      throw new CustomError("Количество должно быть целым неотрицательным числом", 400);
    }

    // Формирование данных продукта
    const productData: Partial<IProduct> = {
      name,
      category: existingCategory._id as mongoose.Types.ObjectId, // Приведение типа
      description,
      image,
      offers: [
        {
          seller: sellerObjectId,
          price: parsedPrice,
          stock: parsedStock,
        },
      ],
      status: "active",
      attributes,
    };

    // Создание нового товара через сервис
    const savedProduct = await createNewProduct(productData);

    // Увеличиваем `productCount` в категории
    await Category.findByIdAndUpdate(existingCategory._id, { $inc: { productCount: 1 } });

    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};


// Обновить товар
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { price, stock, description, image } = req.body;

    const sellerId = req.user?.id; // ID продавца из токена
    if (!sellerId) {
      throw new CustomError("Пользователь не авторизован", 403);
    }

    // Найти продукт по ID
    const product = await Product.findById(id);
    if (!product) {
      throw new CustomError("Товар не найден", 404);
    }

    // Запрет на обновление архивированного товара
    if (product.status === "archived") {
      throw new CustomError("Нельзя обновить архивированный товар", 400);
    }

    // Найти предложение продавца
    const offer = product.offers.find((offer) => offer.seller.toString() === sellerId);
    if (!offer) {
      throw new CustomError("Предложение для этого продавца не найдено", 404);
    }

    // Обновляем поля предложения
    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        throw new CustomError("Цена должна быть положительным числом", 400);
      }
      offer.price = parsedPrice;
    }

    if (stock !== undefined) {
      const parsedStock = Number(stock);
      if (!Number.isInteger(parsedStock) || parsedStock < 0) {
        throw new CustomError("Количество должно быть целым неотрицательным числом", 400);
      }
      offer.stock = parsedStock;
    }

    if (description !== undefined && typeof description === "string") {
      offer.description = description.trim();
    }

    if (image !== undefined) {
      if (!/^https?:\/\/.*\.(png|jpg|jpeg|svg)$/i.test(image)) {
        throw new CustomError("Изображение должно быть корректным URL", 400);
      }
      offer.image = image;
    }

    // Сохранить изменения продукта
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Предложение успешно обновлено",
      product: updatedProduct,
      offer,
    });
  } catch (error) {
    console.error("Ошибка при обновлении предложения:", error);
    next(error);
  }
};


// Получить товар по ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const product = await findProductById(id);
    if (!product) {
      throw new CustomError("Товар не найден", 404);
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Ошибка при получении товара по ID:", error);
    next(error);
  }
};

export const updateProductOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new CustomError("Не удалось определить продавца", 400);
    }

    const updates = req.body; // Получаем все данные из тела запроса

    const product = await Product.findById(id);
    if (!product) {
      throw new CustomError("Товар не найден", 404);
    }

    let offer = product.offers.find((offer) => offer.seller.toString() === sellerId);

    if (!offer) {
      console.log("Предложение для этого продавца отсутствует. Создаём новое предложение.");
      offer = {
        seller: new mongoose.Types.ObjectId(sellerId),
        price: 0,
        stock: 0,
        customFields: {}, // Инициализируем customFields, если его нет
      };
      product.offers.push(offer);
    }

    // Обновляем или добавляем строго определенные поля
    if (updates.price !== undefined) {
      const parsedPrice = typeof updates.price === "string" ? parseFloat(updates.price) : updates.price;
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        throw new CustomError("Цена должна быть положительным числом", 400);
      }
      offer.price = parsedPrice;
    }

    if (updates.stock !== undefined) {
      const parsedStock = typeof updates.stock === "string" ? parseInt(updates.stock, 10) : updates.stock;
      if (!Number.isInteger(parsedStock) || parsedStock < 0) {
        throw new CustomError("Количество должно быть целым неотрицательным числом", 400);
      }
      offer.stock = parsedStock;
    }

    if (updates.description !== undefined) {
      if (typeof updates.description !== "string") {
        throw new CustomError("Описание должно быть строкой", 400);
      }
      offer.description = updates.description;
    }

    if (updates.image !== undefined) {
      if (typeof updates.image !== "string" || !/^https?:\/\/.*\.(png|jpg|jpeg|svg)$/i.test(updates.image)) {
        throw new CustomError("Изображение должно быть корректным URL", 400);
      }
      offer.image = updates.image;
    }

    // Обновляем или добавляем произвольные поля в `customFields`
    offer.customFields = offer.customFields || {}; // Гарантируем, что customFields инициализирован как объект

    Object.keys(updates).forEach((key) => {
      if (!["price", "stock", "description", "image", "seller"].includes(key)) {
       // Проверяем наличие customFields и присваиваем значение
      if (!offer.customFields) {
        offer.customFields = {};
      }
        offer.customFields[key] = updates[key];
      }
    });


    await product.save();

    res.status(200).json({
      message: "Предложение успешно обновлено",
      offer,
    });
  } catch (error) {
    console.error("Ошибка при обновлении/создании предложения продавца:", error);
    next(error);
  }
};

export const getProductForSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const sellerId = req.user!.id;

    const product = await Product.findById(id);
    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    const offer = product.offers.find((offer) => offer.seller.toString() === sellerId);
    const description = offer?.description || product.description;
    const image = offer?.image || product.image;

    res.status(200).json({ product, sellerDescription: description, sellerImage: image });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      category,
      status,
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    const query: Record<string, any> = {};

    if (category) {
      const categoryDoc = mongoose.isValidObjectId(category)
        ? await Category.findById(category)
        : await Category.findOne({ name: category });
      if (!categoryDoc) {
        console.error("Категория не найдена:", category);
        throw new CustomError("Категория не найдена", 404);
      }
      query.category = categoryDoc._id;
      console.log("Фильтрация по категории:", categoryDoc);
    }

    if (status) query.status = status;

    if (minPrice || maxPrice) {
      query["offers.price"] = {};
      if (minPrice) query["offers.price"].$gte = parseFloat(minPrice as string);
      if (maxPrice) query["offers.price"].$lte = parseFloat(maxPrice as string);
    }

    console.log("Запрос к базе данных:", query);

    // Настройка опций
    const options = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      sort: { [sortBy as string]: sortOrder === "desc" ? -1 : 1 } as Record<string, SortOrder>,
    };

    const { products, total } = await findProducts(query, options);

    console.log("Найдено товаров от продавцов:", total);

    res.status(200).json({
      total,
      page: options.page,
      limit: options.limit,
      products,
    });
  } catch (error) {
    console.error("Ошибка при получении списка товаров:", error);
    next(new CustomError("Не удалось получить список товаров. Попробуйте позже.", 500));
  }
};

export const deleteProductOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("Начало обработки запроса DELETE /:id/offer");
    const { id } = req.params;
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new CustomError("Не удалось определить продавца", 400);
    }

    console.log(`Удаление предложения продавца. Товар ID: ${id}, Продавец ID: ${sellerId}`);

    const product = await Product.findById(id);

    if (!product) {
      throw new CustomError("Товар не найден", 404);
    }

    console.log("Товар найден:", product);

    // Проверяем, есть ли предложение продавца
    const offerExists = product.offers.some((offer) => offer.seller.toString() === sellerId);
    if (!offerExists) {
      throw new CustomError("Предложение этого продавца не найдено в этом товаре", 404);
    }

    // Удаляем предложение продавца
    product.offers = product.offers.filter((offer) => offer.seller.toString() !== sellerId);
    

    console.log("Обновленные предложения после удаления:", product.offers);

    // Если массив `offers` пуст, меняем статус на "out of stock"
    if (product.offers.length === 0) {
      product.status = "out of stock";
    }

    // Сохраняем обновлённый продукт
    await product.save();

    res.status(200).json({ message: "Предложение успешно удалено", product });
  } catch (error) {
    console.error("Ошибка при удалении предложения:", error);
    next(error);
  }
};

// Удалить товар
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role || ""; // Указываем значение по умолчанию для userRole

    // Проверяем роль пользователя
    if (!["admin", "manager"].includes(userRole)) {
      throw new CustomError("Only administrators or managers can delete products", 403);
    }

    // Находим товар, чтобы получить категорию
    const product = await findProductById(id);

    if (!product) {
      throw new CustomError("Product not found", 404);
    }

    // Если товар связан с предложениями нескольких продавцов
    if (product.offers.length > 1 && userRole !== "admin") {
      throw new CustomError(
        "This product has offers from multiple sellers. Only administrators can delete it.",
        403
      );
    }

    // Удаляем товар
    await deleteProductById(id);

    // Уменьшаем productCount в категории
    if (product.category) {
      await Category.findOneAndUpdate(
        { name: product.category },
        { $inc: { productCount: -1 } }
      );
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

