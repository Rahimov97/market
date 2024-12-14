import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProducts,
} from "../controllers/products";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
