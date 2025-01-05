import { Product, IProduct } from "../../models/Product";
import { FilterQuery, SortOrder, UpdateQuery } from "mongoose";
import mongoose from "mongoose";
import { Category } from "../../models/Category";

/**
 * @param query - Фильтр для поиска товаров.
 * @param options - Параметры пагинации и сортировки.
 * @returns Список товаров и общее количество товаров.
 */
export const findProducts = async (
  query: FilterQuery<IProduct>,
  options: { page: number; limit: number; sort: { [key: string]: SortOrder } }
) => {
  const { page, limit, sort } = options;
  try {
    console.log("Фильтр для поиска товаров:", query);

    const products = await Product.find(query)
      .populate("category", "name slug") // Подставляем данные категории (имя, slug)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Product.countDocuments(query);

    console.log("Найдено товаров:", total);

    return { products, total };
  } catch (error) {
    console.error("Ошибка при поиске товаров:", error);
    throw new Error("Не удалось получить список товаров. Попробуйте позже.");
  }
};

/**
 * @param id - Идентификатор товара.
 * @returns Найденный товар или null, если товар не найден.
 */
export const findProductById = async (id: string) => {
  try {
    return await Product.findById(id);
  } catch (error) {
    console.error("Ошибка при поиске товара по ID:", error);
    throw new Error("Не удалось получить данные о товаре. Попробуйте позже.");
  }
};

/**
 * @param productData - Данные для создания нового товара.
 * @returns Созданный товар.
 */
export const createNewProduct = async (productData: Partial<IProduct>): Promise<IProduct> => {
  try {
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    // Увеличиваем `productCount` в категории
    if (productData.category) {
      await Category.findByIdAndUpdate(productData.category as mongoose.Types.ObjectId, {
        $inc: { productCount: 1 },
      });
    }

    return savedProduct;
  } catch (error) {
    console.error("Ошибка при создании нового товара:", error);
    throw new Error("Не удалось создать товар. Проверьте введенные данные и попробуйте снова.");
  }
};

/**
 * @param productId - Идентификатор товара.
 * @param sellerId - Идентификатор продавца.
 * @param updates - Данные для обновления предложения.
 * @returns Обновленный товар или null, если товар не найден.
 */
export const updateOfferForSeller = async (
  productId: string,
  sellerId: string,
  updates: Record<string, any>
): Promise<IProduct> => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Товар не найден.");
    }

    // Найти или создать предложение
    let offer = product.offers.find((offer) => offer.seller.toString() === sellerId);
    if (!offer) {
      console.log("Создание нового предложения для продавца.");
      offer = {
        seller: new mongoose.Types.ObjectId(sellerId),
        price: 0,
        stock: 0,
        customFields: {}, // Инициализация customFields для нового предложения
      };
      product.offers.push(offer);
    }

    // Обновляем стандартные поля
    const standardFields = ["price", "stock", "description", "image"] as const;
    standardFields.forEach((field) => {
      if (updates[field] !== undefined) {
        const value = updates[field];
        if (field === "price" && (typeof value !== "number" || value <= 0)) {
          throw new Error("Цена должна быть положительным числом.");
        }
        if (field === "stock" && (typeof value !== "number" || !Number.isInteger(value) || value < 0)) {
          throw new Error("Количество должно быть целым неотрицательным числом.");
        }
        (offer as any)[field] = value; // Явное указание TypeScript на динамическое обновление
      }
    });

    // Обновляем произвольные поля
    offer.customFields = offer.customFields || {};
    Object.keys(updates).forEach((key) => {
      if (!standardFields.includes(key as any) && key !== "seller") {
        offer.customFields![key] = updates[key];
      }
    });

    await product.save();
    return product;
  } catch (error) {
    console.error("Ошибка при обновлении предложения продавца:", error);
    throw new Error("Не удалось обновить предложение продавца.");
  }
};

/**
 * @param productId - Идентификатор товара.
 * @param sellerId - Идентификатор продавца.
 * @returns Обновленный товар или null, если товар не найден.
 */
export const removeOfferBySeller = async (productId: string, sellerId: string) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Товар не найден.");
    }

    product.offers = product.offers.filter((offer) => offer.seller.toString() !== sellerId);

    if (product.offers.length === 0) {
      product.status = "out of stock";
    } else {
      product.status = "active"; // Меняем статус обратно на "active", если предложения есть
    }

    await product.save();
    return product;
  } catch (error) {
    console.error("Ошибка при удалении предложения продавца:", error);
    throw new Error("Не удалось удалить предложение продавца.");
  }
};

/**
 * Обновляет существующий товар.
 * @param id - Идентификатор товара.
 * @param updates - Данные для обновления.
 * @returns Обновленный товар или null, если товар не найден.
 */
export const updateExistingProduct = async (
  id: string,
  updates: UpdateQuery<Partial<IProduct>>
): Promise<IProduct | null> => {
  try {
    return await Product.findByIdAndUpdate(id, updates, {
      new: true, // Возвращает обновленный документ.
      runValidators: true, // Запускает валидаторы модели.
    });
  } catch (error) {
    console.error("Ошибка при обновлении товара:", error);
    throw new Error("Не удалось обновить товар. Проверьте данные и попробуйте снова.",);
  }
};


/**
 * @param id - Идентификатор товара.
 * @returns Удаленный товар или null, если товар не найден.
 */
export const deleteProductById = async (id: string) => {
  try {
    return await Product.findByIdAndDelete(id);
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    throw new Error("Не удалось удалить товар. Попробуйте позже.");
  }
};
