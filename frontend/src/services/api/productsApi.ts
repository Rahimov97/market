import api from "@/services/api/api";

export const getProducts = async () => {
  try {
    const response = await api.get("/products");
    console.log("Полученные данные:", response.data); 
    return response.data.products; 
  } catch (error) {
    console.error("Ошибка при получении списка товаров:", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);

    if (!response.data || typeof response.data !== "object") {
      throw new Error("Некорректный формат ответа от сервера");
    }

    return response.data;
  } catch (error: any) {
    console.error("[productsApi] Ошибка при получении данных о товаре:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Ошибка при загрузке данных о товаре");
  }
};
