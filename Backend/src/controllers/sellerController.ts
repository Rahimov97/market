import { Request, Response } from 'express';
import { Seller } from '../models/Seller';

// Получить всех продавцов
export const getSellers = async (req: Request, res: Response): Promise<void> => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Получить продавца по ID
export const getSellerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      res.status(404).json({ message: 'Seller not found' });
      return;
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Создать нового продавца
export const createSeller = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, rating, location } = req.body;

    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }

    const newSeller = new Seller({ name, rating, location });
    const savedSeller = await newSeller.save();

    res.status(201).json(savedSeller);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Обновить информацию о продавце
export const updateSeller = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, rating, location } = req.body;

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { name, rating, location },
      { new: true, runValidators: true }
    );

    if (!updatedSeller) {
      res.status(404).json({ message: 'Seller not found' });
      return;
    }

    res.json(updatedSeller);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Удалить продавца
export const deleteSeller = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedSeller = await Seller.findByIdAndDelete(id);

    if (!deletedSeller) {
      res.status(404).json({ message: 'Seller not found' });
      return;
    }

    res.json({ message: 'Seller deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
