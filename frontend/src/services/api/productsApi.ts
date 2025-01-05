import api from "@/services/api/api";

// Получение списка товаров
export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении списка товаров:", error);
    throw error;
  }
};

// Получение данных о товаре по ID
export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении данных о товаре:", error);
    throw error;
  }
};
