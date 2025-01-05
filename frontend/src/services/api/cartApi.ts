import api from "@/services/api/api";

export const addToCart = async (productId: string, quantity: number = 1) => {
  try {
    const response = await api.post("/cart/add", { productId, quantity });
    return response.data;
  } catch (error: any) {
    console.error("Ошибка при добавлении товара в корзину:", error.response?.data || error.message);
    throw error;
  }
};

export const updateCartQuantity = async (productId: string, quantity: number) => {
  console.log("Sending update request:", { productId, quantity });
  try {
    const response = await api.put("/cart/update", { productId, quantity });
    console.log("Update request successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Ошибка при обновлении количества товара в корзине:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const removeFromCart = async (productId: string) => {
  try {
    console.log("Sending remove request for productId:", productId);
    const response = await api.delete(`/cart/remove?productId=${productId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "Ошибка при удалении товара из корзины:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getCart = async () => {
  try {
    const response = await api.get("/cart");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении содержимого корзины:", error);
    throw error;
  }
};
