import express from "express";
import {
  createProduct,
  updateProduct,
  getProductById,
  getProducts,
  deleteProduct,
  updateProductOffer,
  deleteProductOffer,
  getProductForSeller,
} from "../controllers/products/productController";
import {
  validateProductCreation,
  validateProductUpdate,
  validateGetProductById,
  validateUpdateOffer,
  validateDeleteOffer,
} from "../validations/productValidation";
import authMiddleware, { roleMiddleware } from "../middleware/authMiddleware";
import validationMiddleware from "../middleware/validationMiddleware";

const router = express.Router();

const sellerAuthMiddleware = [authMiddleware, roleMiddleware("seller")];

router.post(
  "/",
  ...sellerAuthMiddleware,
  validateProductCreation,
  validationMiddleware,
  createProduct 
);

router.put(
  "/:id",
  ...sellerAuthMiddleware,
  validateProductUpdate,
  validationMiddleware,
  updateProduct
);

router.put(
  "/:id/offer",
  ...sellerAuthMiddleware,
  validateUpdateOffer, 
  validationMiddleware,
  updateProductOffer
);

router.delete(
  "/:id/offer", 
  ...sellerAuthMiddleware,
  validateDeleteOffer,
  validationMiddleware,
  deleteProductOffer
);

router.delete(
  "/:id", 
  ...sellerAuthMiddleware,
  roleMiddleware(["admin", "manager"]),
  validateGetProductById,
  validationMiddleware,
  deleteProduct
);

router.get(
  "/:id/seller",
  ...sellerAuthMiddleware,
  validateGetProductById, 
  validationMiddleware,
  getProductForSeller
);

router.get("/:id", validateGetProductById, validationMiddleware, getProductById);
router.get("/", getProducts); 

export default router;
