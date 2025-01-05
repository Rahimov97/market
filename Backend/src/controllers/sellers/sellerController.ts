import { Request, Response, NextFunction } from "express";
import { Seller } from "../../models/Seller";
import { CustomError } from "../../middleware/errorMiddleware";

// Получить всех продавцов
export const getSellers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sellers = await Seller.find().select("-bankDetails -password"); // Убираем конфиденциальные данные
    res.status(200).json(sellers);
  } catch (error) {
    next(error);
  }
};

// Получить продавца по ID
export const getSellerById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new CustomError("Invalid Seller ID format", 400);
    }

    const seller = await Seller.findById(id).select("-bankDetails -password");
    if (!seller) throw new CustomError("Seller not found", 404);

    res.status(200).json(seller);
  } catch (error) {
    next(error);
  }
};

// Обновить данные продавца
export const updateSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new CustomError("Invalid Seller ID format", 400);
    }

    const seller = await Seller.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select(
      "-password"
    );
    if (!seller) throw new CustomError("Seller not found", 404);

    res.status(200).json(seller);
  } catch (error) {
    next(error);
  }
};

// Удалить продавца
export const deleteSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new CustomError("Invalid Seller ID format", 400);
    }

    const seller = await Seller.findByIdAndDelete(id);
    if (!seller) throw new CustomError("Seller not found", 404);

    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    next(error);
  }
};
