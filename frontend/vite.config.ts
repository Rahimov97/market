import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Настраиваем алиас @ для папки src
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // URL вашего бэкенд-сервера
        changeOrigin: true,             // Изменяет заголовок Origin в запросах
        secure: false,                  // Отключаем проверку SSL, если API использует HTTP
      },
    },
  },
});
