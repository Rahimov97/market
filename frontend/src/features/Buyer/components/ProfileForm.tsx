import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Avatar,
  Input,
  CircularProgress,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { fetchProfile, updateProfile } from "../api/profileApi";
import { useAuthContext } from "@/context/AuthContext";

interface Profile {
  firstName: string;
  lastName?: string;
  email?: string;
  phone: string;
  gender?: string;
  birthDate?: string;
  avatar?: string | File; // <-- Позволяем хранить либо строку (URL), либо файл
}

// Функция для форматирования даты
const formatDate = (date: string | undefined) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

interface ProfileFormProps {
  onUpdateSuccess?: () => void;
  onUpdateError?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onUpdateSuccess, onUpdateError }) => {
  const [profile, setProfile] = useState<Profile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    avatar: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuthContext();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setProfile({
          ...data,
          birthDate: formatDate(data.birthDate),
        });
        setAvatarPreview(data.avatar ? `http://localhost:5000${data.avatar}` : null);
      } catch (error) {
        console.error("Ошибка загрузки профиля:", error);
        if (onUpdateError) onUpdateError();
      }
    };
    loadProfile();
  }, [onUpdateError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Упрощенная логика работы с файлом:
  // При выборе файла сразу делаем preview и сохраняем сам файл в profile.avatar
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(selectedFile));
      setProfile((prev) => ({ ...prev, avatar: selectedFile }));
    }
  };

  const createFormData = () => {
    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (value) {
        // Если avatar — это файл, добавляем его как файл
        if (key === "avatar" && value instanceof File) {
          formData.append(key, value);
        } else if (key !== "avatar") {
          formData.append(key, value as string);
        }
      }
    });
    return formData;
  };

  const validateFields = () => {
    if (!profile.firstName.trim()) {
      if (onUpdateError) onUpdateError();
      return false;
    }
    if (!profile.phone.trim()) {
      if (onUpdateError) onUpdateError();
      return false;
    }
    if (profile.birthDate && new Date(profile.birthDate) > new Date()) {
      if (onUpdateError) onUpdateError();
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);

    try {
      const formData = createFormData();
      const response = await updateProfile(formData);
      updateUser(response.user);
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
      if (onUpdateError) onUpdateError();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto", mt: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3} align="center">
        Настройки профиля
      </Typography>

      <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
        <Avatar
          src={avatarPreview || "https://via.placeholder.com/100"}
          alt="Аватар"
          sx={{ width: 120, height: 120, mr: 3 }}
        />
        <Input type="file" onChange={handleFileChange} />
      </Box>

      <TextField
        label="Имя"
        name="firstName"
        value={profile.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        placeholder="Введите имя"
      />
      <TextField
        label="Телефон"
        name="phone"
        value={profile.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        placeholder="+992 999 99 99 99"
      />
      <TextField
        label="Фамилия"
        name="lastName"
        value={profile.lastName || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="Введите фамилию"
      />
      <TextField
        label="Email"
        name="email"
        value={profile.email || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
        type="email"
        placeholder="Введите email"
      />

      <FormControl component="fieldset" margin="normal">
        <Typography variant="subtitle1" mb={1}>
          Пол
        </Typography>
        <RadioGroup
          row
          name="gender"
          value={profile.gender || ""}
          onChange={handleChange}
        >
          <FormControlLabel value="М" control={<Radio />} label="Мужчина" />
          <FormControlLabel value="Ж" control={<Radio />} label="Женщина" />
        </RadioGroup>
      </FormControl>

      <TextField
        label="Дата рождения"
        name="birthDate"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={profile.birthDate || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button variant="contained" type="submit" fullWidth disabled={loading} sx={{ mt: 2 }}>
        {loading ? <CircularProgress size={24} /> : "Сохранить изменения"}
      </Button>
    </Box>
  );
};

export default ProfileForm;
