const API_BASE_URL = "http://localhost:5000/api/products"; // Замените URL на ваш реальный

// Получение всех продуктов
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error in fetchProducts:", error.message);
    throw error;
  }
};

// Получение продукта по ID
export const fetchProductById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error in fetchProductById:", error.message);
    throw error;
  }
};
