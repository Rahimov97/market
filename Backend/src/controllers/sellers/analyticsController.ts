import { Request, Response, NextFunction } from "express";
import { Seller } from "../../models/Seller";
import { Order } from "../../models/Order";
import { Product } from "../../models/Product";
import { CustomError } from "../../middleware/errorMiddleware";

// Получить общую аналитику продавца
export const getSellerAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new CustomError("Unauthorized access. Seller ID is missing.", 401);
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      throw new CustomError("Seller not found.", 404);
    }

    // Возвращаем общую аналитику
    res.status(200).json({
      totalSales: seller.analytics.totalSales,
      totalOrders: seller.analytics.totalOrders,
      totalProductsSold: seller.analytics.totalProductsSold,
      views: seller.analytics.views,
      lastActive: seller.analytics.lastActive,
      revenueByMonth: seller.analytics.revenueByMonth,
    });
  } catch (error) {
    next(error);
  }
};

// Получить аналитику продаж по продуктам
export const getProductSalesAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new CustomError("Unauthorized access. Seller ID is missing.", 401);
    }

    const products = await Product.find({ "offers.seller": sellerId }).select("name offers");

    const analytics = products.map((product) => {
      const sellerOffer = product.offers.find((offer) => offer.seller.toString() === sellerId);

      return {
        productId: product._id,
        name: product.name,
        totalStock: sellerOffer?.stock || 0,
        totalRevenue: (sellerOffer?.price || 0) * (sellerOffer?.stock || 0),
      };
    });

    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};

// Получить доход за указанный период
export const getRevenueByPeriod = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new CustomError("Unauthorized access. Seller ID is missing.", 401);
    }

    if (!startDate || !endDate) {
      throw new CustomError("Start date and end date are required.", 400);
    }

    const orders = await Order.find({
      "items.seller": sellerId,
      createdAt: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) },
    });

    const totalRevenue = orders.reduce((acc, order) => {
      const sellerItems = order.items.filter((item) => item.seller.toString() === sellerId);
      const orderRevenue = sellerItems.reduce((sum, item) => sum + item.subtotal, 0);
      return acc + orderRevenue;
    }, 0);

    res.status(200).json({ totalRevenue, startDate, endDate });
  } catch (error) {
    next(error);
  }
};

// Получить популярные товары
export const getPopularProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new CustomError("Unauthorized access. Seller ID is missing.", 401);
    }

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

    const popularProducts = products.map((product) => ({
      productId: product._id.toString(), // Приводим _id к строке
      name: product.name,
      image: product.image,
      totalSales: productSales[product._id.toString()],
    }));

    res.status(200).json(popularProducts);
  } catch (error) {
    next(error);
  }
};

// Получить аналитику по складам
export const getWarehouseAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      throw new CustomError("Unauthorized access. Seller ID is missing.", 401);
    }

    const seller = await Seller.findById(sellerId).select("warehouses");

    if (!seller) {
      throw new CustomError("Seller not found.", 404);
    }

    const warehouseAnalytics = seller.warehouses.map((warehouse) => {
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

    res.status(200).json(warehouseAnalytics);
  } catch (error) {
    next(error);
  }
};
