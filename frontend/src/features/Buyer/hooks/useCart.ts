import { useState, useEffect } from "react";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/services/api/cartApi";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // Добавьте любые другие поля, которые есть в товаре корзины
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null); // Очистка ошибок перед новым запросом
      const data = await getCart();
      setCart(data.items || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
      await addToCart(productId, quantity);
      await fetchCart(); // Обновляем корзину после добавления
    } catch (err: any) {
      setError(err.message || "Failed to add item to cart");
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      await removeFromCart(productId);
      await fetchCart(); // Обновляем корзину после удаления
    } catch (err: any) {
      setError(err.message || "Failed to remove item from cart");
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId: string, quantity: number) => {
    try {
      console.log("Calling updateCartQuantity:", { productId, quantity });
      await updateCartQuantity(productId, quantity);
      await fetchCart(); // Обновляем корзину после изменения количества
    } catch (err: any) {
      console.error("Error updating quantity:", err.response?.data || err.message);
      setError(err.message || "Failed to update cart quantity");
    }
  };
  
  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
  };
};
