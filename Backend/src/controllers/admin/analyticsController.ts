import { Request, Response, NextFunction } from "express";
import { User } from "../../models/User";
import { Product } from "../../models/Product";
import { Order } from "../../models/Order";

interface QueryParams {
  startDate?: string;
  endDate?: string;
}

const buildDateFilter = (startDate?: string, endDate?: string) => {
  const dateFilter: any = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);
  return dateFilter;
};

// Аналитика пользователей
export const getUserAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as QueryParams;
    const dateFilter = buildDateFilter(startDate, endDate);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const newUsers = startDate || endDate ? await User.countDocuments({ createdAt: dateFilter }) : 0;

    res.status(200).json({ totalUsers, activeUsers, newUsers });
  } catch (error) {
    next(error);
  }
};

// Аналитика продуктов
export const getProductAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as QueryParams;
    const dateFilter = buildDateFilter(startDate, endDate);

    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: "active" });

    const popularProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { ...(startDate || endDate ? { createdAt: dateFilter } : {}) } },
      {
        $group: {
          _id: "$items.product",
          totalOrders: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
    ]);

    res.status(200).json({ totalProducts, activeProducts, popularProducts });
  } catch (error) {
    next(error);
  }
};

// Аналитика заказов
export const getOrderAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query as QueryParams;
    const dateFilter = buildDateFilter(startDate, endDate);

    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: "delivered" });

    const revenue = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          ...(startDate || endDate ? { createdAt: dateFilter } : {}),
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalTax: { $sum: "$taxAmount" },
          totalShipping: { $sum: "$shippingDetails.shippingCost" },
        },
      },
    ]);

    res.status(200).json({
      totalOrders,
      completedOrders,
      revenue: revenue[0]?.totalRevenue || 0,
      totalTax: revenue[0]?.totalTax || 0,
      totalShipping: revenue[0]?.totalShipping || 0,
    });
  } catch (error) {
    next(error);
  }
};

// Аналитика продавцов
export const getSellerAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellerStats = await Product.aggregate([
      { $unwind: "$offers" },
      {
        $group: {
          _id: "$offers.seller",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$offers.stock" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $project: {
          seller: { $arrayElemAt: ["$seller", 0] },
          totalProducts: 1,
          totalStock: 1,
        },
      },
      { $sort: { totalProducts: -1 } },
    ]);

    res.status(200).json(sellerStats || []);
  } catch (error) {
    next(error);
  }
};

// Общая аналитика
export const getOverallAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {} = req.query as QueryParams;

    const userAnalyticsPromise = getUserAnalytics(req, res, next);
    const productAnalyticsPromise = getProductAnalytics(req, res, next);
    const orderAnalyticsPromise = getOrderAnalytics(req, res, next);

    const [userAnalytics, productAnalytics, orderAnalytics] = await Promise.all([
      userAnalyticsPromise,
      productAnalyticsPromise,
      orderAnalyticsPromise,
    ]);

    res.status(200).json({ userAnalytics, productAnalytics, orderAnalytics });
  } catch (error) {
    next(error);
  }
};
