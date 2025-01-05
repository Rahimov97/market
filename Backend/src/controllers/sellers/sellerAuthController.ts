import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Seller } from "../../models/Seller";
import { CustomError } from "../../middleware/errorMiddleware";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

// Генерация JWT токена
const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// Регистрация продавца
export const registerSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password || !location) {
      throw new CustomError("All fields are required for registration.", 400);
    }

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      throw new CustomError("A seller with this email already exists.", 400);
    }

    const newSeller = new Seller({
      name,
      email,
      password, // Передаем пароль в открытом виде
      location,
      verified: false,
    });

    await newSeller.save();

    const token = generateToken(newSeller._id.toString(), "seller");

    res.status(201).json({ message: "Registration successful.", token });
  } catch (error) {
    next(error);
  }
};

export const loginSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    console.log("Email received:", email);
    console.log("Password received:", password);

    if (!email || !password) {
      throw new CustomError("Email and password are required.", 400);
    }

    const seller = await Seller.findOne({ email }).select("+password");
    if (!seller) {
      console.log("Seller not found with email:", email);
      throw new CustomError("Invalid email or password.", 401);
    }

    console.log("Seller password from DB:", seller.password);

    const isPasswordValid = await bcrypt.compare(password, seller.password!);
    console.log("Passwords match:", isPasswordValid);

    if (!isPasswordValid) {
      throw new CustomError("Invalid email or password.", 401);
    }

    const token = generateToken(seller._id.toString(), "seller");
    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    next(error);
  }
};

// Проверка авторизации продавца
export const checkSellerAuth = (req: Request, res: Response) => {
  res.status(200).json({ message: "Authorized", user: req.user });
};
