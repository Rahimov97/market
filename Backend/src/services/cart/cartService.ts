import { Cart } from "../../models/Cart";
import { Product } from "../../models/Product";
import mongoose, { Types } from "mongoose";

// Проверка, является ли productId заполненным объектом после populate
const isPopulatedProduct = (
  productId: Types.ObjectId | { _id: string; name: string }
): productId is { _id: string; name: string } => {
  return typeof productId === "object" && productId !== null && "_id" in productId && "name" in productId;
};

// Универсальная функция для поиска или создания корзины
const findOrCreateCart = async (userId: string) => {
  const cart = await Cart.findOne({ userId });
  return cart || new Cart({ userId, items: [] });
};

// Добавление товара в корзину
export const addToCart = async (
  userId: string,
  productId: Types.ObjectId,
  quantity: number,
  priceAtAddition: number,
  sellerId: Types.ObjectId,
  options: Map<string, string> = new Map()
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const cart = await findOrCreateCart(userId);

  // Проверяем наличие товара в корзине
  const existingItem = cart.items.find(
    (item) =>
      item.productId instanceof mongoose.Types.ObjectId
        ? item.productId.equals(productId) && item.sellerId.equals(sellerId)
        : isPopulatedProduct(item.productId) &&
          item.productId._id === productId.toString() &&
          item.sellerId.equals(sellerId)
  );

  if (existingItem) {
    // Если товар уже есть, увеличиваем его количество
    existingItem.quantity += quantity;
    existingItem.subtotal = existingItem.quantity * (existingItem.priceAtAddition - (existingItem.discount || 0));
  } else {
    // Если товара нет, добавляем новый элемент
    cart.items.push({
      productId,
      quantity,
      priceAtAddition,
      sellerId,
      options,
      subtotal: quantity * priceAtAddition,
    });
  }

  // Сохраняем корзину
  await cart.save();
  return getCart(userId);
};

// Получение содержимого корзины
export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "name image category",
  });

  if (!cart) return { items: [] };

  return {
    items: cart.items.map((item) => {
      if (isPopulatedProduct(item.productId)) {
        return {
          id: item._id?.toString() || "",
          productId: item.productId._id.toString(),
          name: item.productId.name,
          image: item.productId.image || "",
          quantity: item.quantity,
          subtotal: item.subtotal,
        };
      }

      return {
        id: item._id?.toString() || "",
        productId: item.productId.toString(),
        name: "Unknown Product",
        image: "",
        quantity: item.quantity,
        subtotal: item.subtotal,
      };
    }),
  };
};

// Обновление количества товара
export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const objectId = new mongoose.Types.ObjectId(productId);

  const item = cart.items.find(
    (item) =>
      item.productId instanceof mongoose.Types.ObjectId
        ? item.productId.equals(objectId)
        : isPopulatedProduct(item.productId) && item.productId._id === productId
  );

  if (!item) throw new Error("Item not found in cart");

  item.quantity = quantity;
  item.subtotal = quantity * (item.priceAtAddition - (item.discount || 0));
  await cart.save();

  return getCart(userId);
};

// Удаление товара из корзины
export const removeCartItem = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error("Cart not found");

  const objectId = new mongoose.Types.ObjectId(productId);

  cart.items = cart.items.filter(
    (item) =>
      item.productId instanceof mongoose.Types.ObjectId
        ? !item.productId.equals(objectId)
        : isPopulatedProduct(item.productId) && item.productId._id !== productId
  );

  await cart.save();
  return getCart(userId);
};
