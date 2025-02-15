import { Product } from "../../models/Product";
import mongoose, { Types } from "mongoose";
import CustomError from "../../utils/errorHandler";

// Типизация для фильтрации продуктов
interface ProductFilterParams {
  category?: string;
  status?: "active" | "inactive" | "archived" | "out of stock";
  priceMin?: number;
  priceMax?: number;
  sellerId?: string;
}

// Типизация для обновления предложения
interface OfferUpdateParams {
  price?: number;
  stock?: number;
  description?: string;
  image?: string;
}

// Централизованная функция для фильтрации продуктов
const buildProductFilter = (params: ProductFilterParams) => {
  const filter: any = {};

  if (params.category) filter.category = params.category;
  if (params.status) filter.status = params.status;
  if (params.priceMin) filter["offers.price"] = { $gte: params.priceMin };
  if (params.priceMax) filter["offers.price"] = { ...filter["offers.price"], $lte: params.priceMax };
  if (params.sellerId) filter["offers.seller"] = new mongoose.Types.ObjectId(params.sellerId);

  return filter;
};

// 1. Создание продукта
export const createProduct = async (data: any) => {
  try {
    const newProduct = await Product.create(data);
    return newProduct;
  } catch (error) {
    throw new CustomError("Ошибка при создании продукта", 500);
  }
};

// 2. Получение продуктов с фильтрацией и пагинацией
export const getProducts = async (filterParams: ProductFilterParams, page = 1, limit = 10) => {
  try {
    const filter = buildProductFilter(filterParams);

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await Product.countDocuments(filter);

    return { products, total, page, limit };
  } catch (error) {
    throw new CustomError("Ошибка при получении списка продуктов", 500);
  }
};

// 3. Получение продукта по ID
export const getProductById = async (id: string) => {
  try {
    const product = await Product.findById(id);
    if (!product) throw new CustomError("Продукт не найден", 404);
    return product;
  } catch (error) {
    throw new CustomError("Ошибка при получении продукта", 500);
  }
};

// 4. Обновление продукта
export const updateProduct = async (
  productId: string,
  updates: any,
  sellerId?: string,
  offerUpdates?: OfferUpdateParams
) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new CustomError("Продукт не найден", 404);

    // Обновление основной информации о продукте
    if (updates) {
      Object.assign(product, updates);
    }

    // Обновление предложения
    if (sellerId && offerUpdates) {
      const offer = product.offers.find((o) => o.seller.toString() === sellerId);
      if (!offer) throw new CustomError("Предложение не найдено", 404);

      Object.assign(offer, offerUpdates);
    }

    await product.save();
    return product;
  } catch (error) {
    throw new CustomError("Ошибка при обновлении продукта", 500);
  }
};

// 5. Удаление продукта или предложения
export const deleteProduct = async (productId: string, sellerId?: string) => {
  try {
    const product = await Product.findById(productId);
    if (!product) throw new CustomError("Продукт не найден", 404);

    if (sellerId) {
      const offerIndex = product.offers.findIndex((o) => o.seller.toString() === sellerId);
      if (offerIndex === -1) throw new CustomError("Предложение не найдено", 404);

      product.offers.splice(offerIndex, 1);

      // Если больше нет предложений, обновляем статус продукта
      if (product.offers.length === 0) {
        product.status = "out of stock";
      }

      await product.save();
      return { message: "Предложение успешно удалено" };
    } else {
      await Product.findByIdAndDelete(productId);
      return { message: "Продукт успешно удалён" };
    }
  } catch (error) {
    throw new CustomError("Ошибка при удалении продукта или предложения", 500);
  }
};

// 6. Управление статусами продукта
export const updateProductStatus = async (
  productId: string,
  status: "active" | "inactive" | "archived" | "out of stock"
) => {
  try {
    const product = await Product.findByIdAndUpdate(
      productId,
      { status },
      { new: true, runValidators: true }
    );
    if (!product) throw new CustomError("Продукт не найден", 404);
    return product;
  } catch (error) {
    throw new CustomError("Ошибка при обновлении статуса продукта", 500);
  }
};
