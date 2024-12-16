import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";

// Регистрация покупателя
export const registerBuyer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, phone, password } = req.body;

    if (!firstName || !phone || !password) {
      res.status(400).json({ message: "All fields are required: firstName, phone, password." });
      return;
    }

    const existingUser = await User.findOne({ phone, role: "user" });
    if (existingUser) {
      res.status(400).json({ message: "User with this phone already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      phone,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, firstName: user.firstName, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d", encoding: "utf8" }
    );

    res.status(201).json({ message: "Registration successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// Авторизация покупателя
export const loginBuyer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ message: "Phone and password are required." });
      return;
    }

    const user = await User.findOne({ phone, role: "user" });
    if (!user || !user.password) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, firstName: user.firstName, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d", encoding: "utf8" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// Профиль покупателя
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id; // Теперь TypeScript не ругается

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};