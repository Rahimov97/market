import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // URL вашего бэкенда

// Получить все товары
export const getProducts = async (search: string = '') => {
  const response = await axios.get(`${API_BASE_URL}/products`, {
    params: { search },
  });
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

  export const uploadProduct = async (data: FormData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading product:', error);
      throw error;
    }
  };
  
  export const deleteProduct = async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/products/${id}`);
    return response.data;
  };
  