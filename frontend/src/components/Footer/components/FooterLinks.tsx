import React from "react";
import { Box, Grid, IconButton, Typography, Link } from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

// Типы для ссылок
type LinkItem = string | { icon: React.ReactNode; link: string };

// Данные для колонок
const links: { title: string; items: LinkItem[] }[] = [
  {
    title: "Покупателям",
    items: [
      "Как выбрать товар", 
      "Оплата и доставка", 
      "Обратная связь", 
      "Покупайте как юрлицо", 
      "О сервисе", 
      "Возвраты"
    ],
  },
  {
    title: "Продавцам",
    items: [
      "Личный кабинет продавца", 
      "Продавайте на Маркете", 
      "Документация для партнёров", 
      "Сайт для партнёров"
    ],
  },
  {
    title: "Сотрудничество",
    items: [
      "Новости компании",
      "Партнёрская программа",
      "Программа для блогеров",
      "Производителям",
    ],
  },
  {
    title: "Мы в соцсетях",
    items: [
      { icon: <TelegramIcon sx={{ fontSize: 24 }} />, link: "https://t.me/" },
      { icon: <WhatsAppIcon sx={{ fontSize: 24 }} />, link: "https://wa.me/" },
    ],
  },
];

const FooterLinks: React.FC = () => {
  return (
    <Grid container spacing={4}>
      {links.map((column, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: column.title === "Мы в соцсетях" ? "8px" : "16px",
            }}
          >
            {column.title}
          </Typography>
          {column.title === "Мы в соцсетях" ? (
            <Box
              sx={{
                display: "flex",
                gap: "16px",
                marginTop: "8px",
              }}
            >
              {column.items.map(
                (item, idx) =>
                  typeof item === "object" && (
                    <IconButton
                      key={idx}
                      component="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: "#444",
                        "&:hover": { color: "#000" },
                      }}
                    >
                      {item.icon}
                    </IconButton>
                  )
              )}
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {column.items.map(
                (item, idx) =>
                  typeof item === "string" && (
                    <Link
                      key={idx}
                      href="#"
                      color="inherit"
                      underline="none"
                      sx={{
                        fontSize: "14px",
                        color: "#444",
                        "&:hover": { textDecoration: "underline", color: "#000" },
                      }}
                    >
                      {item}
                    </Link>
                  )
              )}
            </Box>
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default FooterLinks;
