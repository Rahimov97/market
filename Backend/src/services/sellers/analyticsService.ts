import { Seller } from "../../models/Seller";
import { Order } from "../../models/Order";
import { Product } from "../../models/Product";

// Получить общую аналитику
export const fetchSellerAnalytics = async (sellerId: string) => {
  const seller = await Seller.findById(sellerId);
  if (!seller) {
    throw new Error("Seller not found");
  }

  return seller.analytics;
};

// Получить аналитику продаж по продуктам
export const fetchProductSalesAnalytics = async (sellerId: string) => {
  const products = await Product.find({ "offers.seller": sellerId }).select("name offers");

  return products.map((product) => {
    const sellerOffer = product.offers.find((offer) => offer.seller.toString() === sellerId);
    return {
      productId: product._id,
      name: product.name,
      totalStock: sellerOffer?.stock || 0,
      totalRevenue: (sellerOffer?.price || 0) * (sellerOffer?.stock || 0),
    };
  });
};

// Получить доход за период
export const fetchRevenueByPeriod = async (sellerId: string, startDate: string, endDate: string) => {
  const orders = await Order.find({
    "items.seller": sellerId,
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
  });

  const totalRevenue = orders.reduce((acc, order) => {
    const sellerItems = order.items.filter((item) => item.seller.toString() === sellerId);
    const orderRevenue = sellerItems.reduce((sum, item) => sum + item.subtotal, 0);
    return acc + orderRevenue;
  }, 0);

  return totalRevenue;
};

// Получить популярные товары
export const fetchPopularProducts = async (sellerId: string) => {
  const orders = await Order.find({ "items.seller": sellerId });

  const productSales: Record<string, number> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.seller.toString() === sellerId) {
        productSales[item.product.toString()] =
          (productSales[item.product.toString()] || 0) + item.quantity;
      }
    });
  });

  const products = await Product.find({ _id: { $in: Object.keys(productSales) } }).select(
    "name image"
  );

  return products.map((product) => ({
    productId: product._id,
    name: product.name,
    image: product.image,
    totalSales: productSales[product._id.toString()],
  }));
};

// Получить аналитику по складам
export const fetchWarehouseAnalytics = async (sellerId: string) => {
  const seller = await Seller.findById(sellerId).select("warehouses");

  if (!seller) {
    throw new Error("Seller not found");
  }

  return seller.warehouses.map((warehouse) => {
    const totalStock = warehouse.stock.reduce((acc, item) => acc + item.quantity, 0);
    return {
      address: warehouse.address,
      city: warehouse.city,
      country: warehouse.country,
      totalStock,
      products: warehouse.stock.map((stockItem) => ({
        productId: stockItem.product,
        quantity: stockItem.quantity,
      })),
    };
  });
};
