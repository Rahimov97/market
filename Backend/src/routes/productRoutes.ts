import express from 'express';
import upload from '../middleware/uploadMiddleware'; // Импортируем настроенный uploadMiddleware
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addOfferToProduct,
  addSellerToProduct,
} from '../controllers/productController';

const router = express.Router();

// Роуты
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('image'), createProduct); // Загрузка файла и создание товара
router.put('/:id', upload.single('image'), updateProduct); // Загрузка файла и обновление товара
router.delete('/:id', deleteProduct);
router.post('/:id/offers', addOfferToProduct);
router.post('/:id/sellers', addSellerToProduct);

export default router;
