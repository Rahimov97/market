import express from "express";
import { registerBuyer } from "../controllers/Auth/userRegisterController";
import { loginBuyer } from "../controllers/Auth/userLoginController";
import { getProfile } from "../controllers/Auth/userAuthController";
import {
  updateProfileController,
  updateAvatarController,
  addAddressController,
  removeAddressController,
} from "../controllers/profile/profileController";
import authMiddleware from "../middleware/authMiddleware";
import validationMiddleware from "../middleware/validationMiddleware";
import {
  registerValidation,
  loginValidation,
} from "../validations/authValidation";
import {
  updateProfileValidation,
  updateAvatarValidation,
} from "../validations/userValidation";

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  validationMiddleware,
  registerBuyer
);

router.post(
  "/login",
  loginValidation,
  validationMiddleware,
  loginBuyer
);

router.get("/profile", authMiddleware, getProfile);

router.put(
  "/profile",
  authMiddleware,
  updateProfileValidation,
  validationMiddleware,
  updateProfileController
);

router.put(
  "/profile/avatar",
  authMiddleware,
  updateAvatarValidation, 
  validationMiddleware, 
  updateAvatarController
);

router.post(
  "/profile/address",
  authMiddleware, 
  validationMiddleware, 
  addAddressController
);

router.delete(
  "/profile/address/:index",
  authMiddleware, 
  removeAddressController
);

export default router;
