import { Request, Response, NextFunction } from "express";
import { Product } from "../../models/Product";
import { AuditLog } from "../../models/AuditLog";
import CustomError from "../../utils/errorHandler";

// Централизованная функция для логирования
const logAction = async (actor: string | undefined, action: string, resource: string, resourceId?: string, changes?: any) => {
  if (!actor) {
    throw new CustomError("Не удалось определить актера для действия", 400);
  }
  await AuditLog.create({ actor, action, resource, resourceId, changes });
};

// Централизованная утилита фильтрации
const buildProductFilter = (query: any) => {
  const filter: any = {};
  if (query.category) filter.category = query.category;
  if (query.priceMin) filter.price = { ...filter.price, $gte: Number(query.priceMin) };
  if (query.priceMax) filter.price = { ...filter.price, $lte: Number(query.priceMax) };
  return filter;
};

// Проверка авторизованного пользователя
const ensureAuthorizedUser = (user: { id: string; role: string } | undefined) => {
    if (!user || !user.id || !user.role) {
      throw new CustomError("Пользователь не авторизован", 401);
    }
  };
  
// Контроллеры
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ensureAuthorizedUser(req.user);
  
      const { name, description, category, image, offers, attributes, discount } = req.body;
  
      if (!name || !category || !offers || offers.length === 0) {
        throw new CustomError("Поля 'name', 'category' и хотя бы одно предложение обязательны", 400);
      }
  
      // Проверка валидности скидки
      if (discount) {
        const { percentage, startDate, endDate } = discount;
        if (percentage < 0 || percentage > 100) {
          throw new CustomError("Процент скидки должен быть между 0 и 100", 400);
        }
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
          throw new CustomError("Дата начала скидки не может быть позже даты окончания", 400);
        }
      }
  
      // Проверка структуры offers
      if (!Array.isArray(offers)) {
        throw new CustomError("Поле 'offers' должно быть массивом предложений", 400);
      }
  
      offers.forEach((offer: any) => {
        if (!offer.seller || !offer.price || !offer.stock) {
          throw new CustomError("Каждое предложение должно содержать 'seller', 'price' и 'stock'", 400);
        }
  
        // Если пользователь — продавец, проверяем, что предложения создаются только для него
        if (req.user!.role === "seller" && offer.seller !== req.user!.id) {
          throw new CustomError("Продавец может создавать предложения только для себя", 403);
        }
      });
  
      const newProduct = await Product.create({
        name,
        description,
        category,
        image,
        offers,
        attributes,
        discount,
      });
  
      await logAction(req.user!.id, "CREATE", "Product", newProduct.id, { name, category });
  
      res.status(201).json({
        status: "success",
        message: "Продукт успешно создан",
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  };  

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = buildProductFilter(req.query);
    const { page = 1, limit = 10 } = req.query;

    const products = await Product.find(filter)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      status: "success",
      message: "Список продуктов успешно получен",
      data: products,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new CustomError("Продукт не найден", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Информация о продукте успешно получена",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      ensureAuthorizedUser(req.user);
  
      const { id } = req.params; // ID карточки продукта
      const { name, description, category, image, attributes, discount, sellerId, offerData } = req.body;
  
      const product = await Product.findById(id);
      if (!product) {
        throw new CustomError("Продукт не найден", 404);
      }
  
      // Логика обновления карточки
      if (name || description || category || image || attributes || discount) {
        if (discount) {
          const { percentage, startDate, endDate } = discount;
          if (percentage < 0 || percentage > 100) {
            throw new CustomError("Процент скидки должен быть между 0 и 100", 400);
          }
          if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            throw new CustomError("Дата начала скидки не может быть позже даты окончания", 400);
          }
        }
  
        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.category = category ?? product.category;
        product.image = image ?? product.image;
        product.attributes = attributes ?? product.attributes;
        product.discount = discount ?? product.discount;
  
        await product.save();
  
        await logAction(req.user!.id, "UPDATE", "Product", id, { name, category });
      }
  
      // Логика обновления оффера
      if (sellerId && offerData) {
        const offer = product.offers.find((o) => o.seller.toString() === sellerId);
        if (!offer) {
          throw new CustomError("Предложение не найдено", 404);
        }
  
        // Продавец может обновлять только свои предложения
        if (req.user!.role === "seller" && offer.seller.toString() !== req.user!.id) {
          throw new CustomError("Вы не можете обновить это предложение", 403);
        }
  
        offer.price = offerData.price ?? offer.price;
        offer.stock = offerData.stock ?? offer.stock;
        offer.description = offerData.description ?? offer.description;
        offer.image = offerData.image ?? offer.image;
  
        await product.save();
  
        await logAction(req.user!.id, "UPDATE", "Offer", sellerId, offerData);
      }
  
      res.status(200).json({
        status: "success",
        message: "Обновление выполнено успешно",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  };   
  
  export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      ensureAuthorizedUser(req.user);
  
      const { id } = req.params; // ID карточки продукта
      const { sellerId } = req.body; // ID продавца, чей оффер удаляется
  
      const product = await Product.findById(id);
      if (!product) {
        throw new CustomError("Продукт не найден", 404);
      }
  
      // Логика удаления оффера
      if (sellerId) {
        const offerIndex = product.offers.findIndex((o) => o.seller.toString() === sellerId);
        if (offerIndex === -1) {
          throw new CustomError("Предложение не найдено", 404);
        }
  
        const offer = product.offers[offerIndex];
  
        // Продавец может удалять только свои предложения
        if (req.user!.role === "seller" && offer.seller.toString() !== req.user!.id) {
          throw new CustomError("Вы не можете удалить это предложение", 403);
        }
  
        product.offers.splice(offerIndex, 1);
        await product.save();
  
        await logAction(req.user!.id, "DELETE", "Offer", sellerId);
  
        res.status(200).json({
          status: "success",
          message: "Предложение успешно удалено",
        });
        return; // Завершение после отправки ответа
      }
  
      // Логика удаления всей карточки
      if (req.user!.role === "seller") {
        throw new CustomError("Продавец не может удалить весь продукт", 403);
      }
  
      await Product.findByIdAndDelete(id);
  
      await logAction(req.user!.id, "DELETE", "Product", id);
  
      res.status(200).json({
        status: "success",
        message: "Продукт успешно удалён",
      });
    } catch (error) {
      next(error);
    }
  };
  