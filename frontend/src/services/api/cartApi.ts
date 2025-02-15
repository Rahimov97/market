import api from "@/services/api/api";

export const addToCart = async (productId: string, quantity: number = 1) => {
  try {
    console.info(`[cartApi] Добавление товара в корзину: productId=${productId}, quantity=${quantity}`);
    const response = await api.post("/cart/add", { productId, quantity });
    console.info("[cartApi] Товар добавлен в корзину:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[cartApi] Ошибка при добавлении товара в корзину:", error.response?.data || error.message);
    throw error;
  }
};

export const updateCartQuantity = async (productId: string, quantity: number) => {
  console.info(`[cartApi] Обновление количества товара: productId=${productId}, quantity=${quantity}`);
  try {
    const response = await api.put("/cart/update", { productId, quantity });
    console.info("[cartApi] Количество товара обновлено:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[cartApi] Ошибка при обновлении количества:", error.response?.data || error.message);
    throw error;
  }
};

export const removeFromCart = async (productId: string) => {
  try {
    console.info(`[cartApi] Удаление товара из корзины: productId=${productId}`);
    const response = await api.delete("/cart/remove", { params: { productId } });
    console.info("[cartApi] Товар удален из корзины:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[cartApi] Ошибка при удалении товара из корзины:", error.response?.data || error.message);
    throw error;
  }
};

export const getCart = async () => {
  try {
    console.info("[cartApi] Запрос содержимого корзины...");
    const response = await api.get("/cart");
    
    if (!response.data || !Array.isArray(response.data.items)) {
      console.warn("[cartApi] Данные корзины некорректны:", response.data);
      return [];
    }

    console.info("[cartApi] Корзина загружена:", response.data);
    return response.data.items;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.warn("[cartApi] Ошибка 401: Пользователь не авторизован. Возвращаем пустую корзину.");
      return [];
    }

    console.error("[cartApi] Ошибка при получении содержимого корзины:", error.response?.data || error.message);
    throw error;
  }
};
