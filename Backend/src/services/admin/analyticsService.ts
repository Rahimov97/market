import { User } from "../../models/User";
import { Product } from "../../models/Product";
import { Order } from "../../models/Order";
import { Types } from "mongoose";

// Типизация параметров запроса
interface QueryParams {
  startDate?: string;
  endDate?: string;
}

// Вспомогательная функция для фильтрации по датам
const buildDateFilter = (startDate?: string, endDate?: string) => {
  const dateFilter: any = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);
  return dateFilter;
};

// 1. Аналитика пользователей
export const getUserAnalytics = async (query: QueryParams) => {
  const { startDate, endDate } = query;
  const dateFilter = buildDateFilter(startDate, endDate);

  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const newUsers = startDate || endDate ? await User.countDocuments({ createdAt: dateFilter }) : 0;

  return { totalUsers, activeUsers, newUsers };
};

// 2. Аналитика продуктов
export const getProductAnalytics = async (query: QueryParams) => {
  const { startDate, endDate } = query;
  const dateFilter = buildDateFilter(startDate, endDate);

  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ status: "active" });

  const popularProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $match: {
        ...(startDate || endDate ? { createdAt: dateFilter } : {}),
      },
    },
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

  return { totalProducts, activeProducts, popularProducts };
};

// 3. Аналитика заказов
export const getOrderAnalytics = async (query: QueryParams) => {
  const { startDate, endDate } = query;
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

  return {
    totalOrders,
    completedOrders,
    revenue: revenue[0]?.totalRevenue || 0,
    totalTax: revenue[0]?.totalTax || 0,
    totalShipping: revenue[0]?.totalShipping || 0,
  };
};

// 4. Аналитика продавцов
export const getSellerAnalytics = async () => {
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

  return sellerStats || [];
};

// 5. Общая аналитика
export const getOverallAnalytics = async (query: QueryParams) => {
  const userAnalytics = await getUserAnalytics(query);
  const productAnalytics = await getProductAnalytics(query);
  const orderAnalytics = await getOrderAnalytics(query);

  return { userAnalytics, productAnalytics, orderAnalytics };
};
