import { Seller } from "../../models/Seller";

// Получить всех продавцов
export const getAllSellers = async () => {
  return await Seller.find().select("-bankDetails");
};

// Получить продавца по ID
export const getSellerById = async (id: string) => {
  return await Seller.findById(id).select("-bankDetails");
};

// Обновить данные продавца
export const updateSellerById = async (id: string, updates: Record<string, unknown>) => {
  return await Seller.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
};

// Удалить продавца
export const deleteSellerById = async (id: string) => {
  return await Seller.findByIdAndDelete(id);
};
