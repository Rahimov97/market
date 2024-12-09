import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // URL вашего бэкенда

// Получить все товары
export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
};

// Добавить продавца к товару
export const addSellerToProduct = async (productId: string, sellerData: any) => {
  const response = await axios.post(`${API_BASE_URL}/products/${productId}/sellers`, sellerData);
  return response.data;
};

// Новая функция
export const getProductById = async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  };