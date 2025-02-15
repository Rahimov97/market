import express from 'express';
import productRoutes from './productRoutes';
import sellerRoutes from './sellerRoutes';
import uploadRoutes from './uploadRoutes';
import userRoutes from './userRoutes'; 
import cartRoutes from './cartRoutes';
import categoryRoutes from "./categoryRoutes";
import adminRoutes from "./adminRoutes";
import adminUserRoutes from "./adminUserRoutes";
import adminRoleRoutes from "./adminRoleRoutes";
import adminProductRoutes from "./adminProductRoutes";
import adminOrderRoutes from "./adminOrderRoutes";
import adminAnalyticsRoutes from "./adminAnalyticsRoutes";


const router = express.Router();

router.use('/products', productRoutes);
router.use('/sellers', sellerRoutes);
router.use('/uploads', uploadRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use("/categories", categoryRoutes);
router.use("/admin", adminRoutes);
router.use("/admin/users", adminUserRoutes);
router.use("/admin/roles", adminRoleRoutes);
router.use("/admin/products", adminProductRoutes);
router.use("/admin/orders", adminOrderRoutes);
router.use("/admin/analytics", adminAnalyticsRoutes);

export default router;
