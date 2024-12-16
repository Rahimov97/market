import axios from "axios";

const API_URL = "/api/users/profile";

// Получение профиля
export const fetchProfile = async () => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

// Обновление профиля
export const updateProfile = async (formData: FormData) => {
  const response = await axios.put(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
