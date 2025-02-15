import api from "@/services/api/api";

export const addToCart = async (
  productId: string,
  sellerId: string,
  priceAtAddition: number,
  quantity: number = 1
) => {
  try {
    if (!productId || !sellerId || priceAtAddition == null) {
      throw new Error("Ошибка: Отсутствуют обязательные параметры (productId, sellerId, priceAtAddition)");
    }

    console.info(`[cartApi] Добавление товара в корзину: productId=${productId}, sellerId=${sellerId}, price=${priceAtAddition}, quantity=${quantity}`);

    const response = await api.post("/cart/add", { productId, sellerId, priceAtAddition, quantity });

    console.info("[cartApi] Товар добавлен в корзину:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[cartApi] Ошибка добавления в корзину:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Ошибка при добавлении товара в корзину");
  }
};

export const updateCartQuantity = async (productId: string, quantity: number) => {
  try {
    if (!productId || quantity < 1) {
      throw new Error("Ошибка: productId обязателен и quantity должен быть больше 0");
    }

    console.info(`[cartApi] Обновление количества: productId=${productId}, quantity=${quantity}`);

    const response = await api.put("/cart/update", { productId, quantity });

    console.info("[cartApi] Количество товара обновлено:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[cartApi] Ошибка обновления количества:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Ошибка обновления количества товара");
  }
};

export const removeFromCart = async (productId: string) => {
  try {
    if (!productId) {
      throw new Error("Ошибка: productId обязателен для удаления товара");
    }

    console.info(`[cartApi] Удаление товара из корзины: productId=${productId}`);

    const response = await api.delete(`/cart/remove?productId=${productId}`);

    console.info("[cartApi] Товар удален из корзины:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[cartApi] Ошибка при удалении товара:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Ошибка удаления товара из корзины");
  }
};

export const getCart = async () => {
  try {
    console.info("[cartApi] Запрос корзины...");

    const response = await api.get("/cart");

    console.info("[cartApi] Ответ сервера:", response.data);

    return response.data?.items ?? [];
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.warn("[cartApi] Ошибка 401: Неавторизованный пользователь. Возвращаем пустую корзину.");
      return [];
    }

    console.error("[cartApi] Ошибка получения корзины:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Ошибка получения корзины");
  }
};
