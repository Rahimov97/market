import { useEffect, useState } from "react";
import { getProducts } from "@/services/api/productsApi"; 

export const useProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (!Array.isArray(data)) {
          throw new Error("Некорректный формат данных: `products` отсутствует или не массив");
        }
        setProducts(data);
      } catch (err: any) {
        console.error("[useProducts] Ошибка загрузки товаров:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
};
