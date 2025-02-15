import { useState, useEffect } from "react";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "@/services/api/cartApi";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();

      if (!data || !Array.isArray(data)) {
        throw new Error("Некорректный формат данных корзины");
      }

      setCart(
        data.map((item) => ({
          id: item.id,
          productId: item.productId || item.id,
          name: item.name,
          price: item.subtotal / item.quantity,
          quantity: item.quantity,
        }))
      );
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки корзины");
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const isItemInCart = (productId: string) => {
    return cart.some((item) => item.productId === productId);
  };

  const addItemToCart = async (productId: string, sellerId: string, price: number, quantity: number) => {
    try {
      setLoading(true);
      setError(null);
  
      if (isItemInCart(productId)) {
        await updateItemQuantity(productId, quantity);
      } else {
        await addToCart(productId, sellerId, price, quantity); 
      }
  
      await fetchCart();
    } catch (err: any) {
      setError(err.message || "Ошибка добавления товара в корзину");
    } finally {
      setLoading(false);
    }
  };

  const removeItemFromCart = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      await removeFromCart(productId);
      setCart((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err: any) {
      setError(err.message || "Ошибка удаления товара из корзины");
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItemFromCart(productId);
      return;
    }

    try {
      await updateCartQuantity(productId, quantity);
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      );
    } catch (err: any) {
      setError(err.message || "Ошибка обновления количества товара");
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
    isItemInCart,
  };
};
