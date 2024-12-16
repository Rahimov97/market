import { Request, Response } from "express";
import { User } from "../../models/User";
import bcrypt from "bcrypt";

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    const err = error as Error; // Явное приведение типа
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Request body:", req.body); // Логируем текстовые поля
    console.log("Request file:", req.file); // Логируем загруженный файл
    if (!req.file) {
      console.error("File not received");
      res.status(400).json({ message: "File not uploaded" });
      return;
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      console.error("User not found:", req.user?.id);
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { firstName, lastName, email, phone, gender, birthDate, password } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (birthDate) user.birthDate = new Date(birthDate);

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      console.log("File path saved to DB:", `/uploads/${req.file.filename}`);
      user.avatar = `/uploads/${req.file.filename}`;
    }    

    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        birthDate: user.birthDate,
        avatar: user.avatar,
        role: user.role,
      },
    });
    
  } catch (error) {
    const err = error as Error; // Приведение error к типу Error
    console.error("Error in updateProfile:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


