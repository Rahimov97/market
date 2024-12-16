import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import ProfileForm from "@/features/Buyer/components/ProfileForm";

const menuItems = [
  "Настройки профиля",
  "Купленные товары",
  "Возвраты",
  "Мои отзывы и вопросы",
  "Промокоды",
  "Сравнение",
  "Чат с поддержкой",
  "Справка",
];

const BuyerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProfileUpdateSuccess = () => {
    setSuccessMessage("Профиль успешно обновлён!");
    setErrorMessage(null);
  };

  const handleProfileUpdateError = () => {
    setErrorMessage("Ошибка обновления профиля. Попробуйте ещё раз.");
    setSuccessMessage(null);
  };

  return (
    <Box sx={{ display: "flex", maxWidth: 1200, mx: "auto", mt: 4 }}>
      {/* Левая боковая панель */}
      <Box sx={{ minWidth: 250, pr: 3, borderRight: "1px solid #ddd" }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Меню
        </Typography>
        <Divider />
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              key={index}
              sx={{
                cursor: "pointer",
                backgroundColor: activeTab === index ? "#f0f0f0" : "transparent",
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#f5f5f5" },
                transition: "background-color 0.2s",
              }}
              onClick={() => setActiveTab(index)}
            >
              <ListItemText
                primary={item}
                slotProps={{
                  primary: {
                    style: {
                      fontWeight: activeTab === index ? "bold" : "normal",
                    },
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Основной контент */}
      <Box sx={{ flex: 1, pl: 3 }}>
        {activeTab === 0 && (
          <ProfileForm
            onUpdateSuccess={handleProfileUpdateSuccess}
            onUpdateError={handleProfileUpdateError}
          />
        )}
        {activeTab !== 0 && (
          <Typography variant="h5" sx={{ textAlign: "center", mt: 4 }}>
            Раздел "{menuItems[activeTab]}" в разработке.
          </Typography>
        )}

        {/* Уведомления */}
        <Box sx={{ mt: 3 }}>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default BuyerProfile;
