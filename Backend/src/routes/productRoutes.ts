import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addOfferToProduct,
} from '../controllers/productController';

import { addSellerToProduct } from '../controllers/productController';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/offers', addOfferToProduct);
router.post('/:id/sellers', addSellerToProduct); 

export default router;
