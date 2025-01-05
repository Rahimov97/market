import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

import connectDB from './config/db';
import routes from './routes'; // Импорт единого маршрута
import { errorHandler, notFound } from './middleware/errorMiddleware';

// Проверяем наличие критичных переменных окружения
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

// Подключение к базе данных
connectDB();

const app = express();

// Настройка middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Подключение маршрутов
app.use('/api', routes); // Все маршруты теперь доступны через /api

// Главная страница
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Middleware для обработки ошибок
app.use(notFound);
app.use(errorHandler);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
