import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';
import sellerRoutes from './routes/sellerRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import path from 'path';

// Загрузка переменных окружения
dotenv.config();

// Подключение к базе данных
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Роуты
app.use('/api/products', productRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Базовый роут
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Подключение обработчика для несуществующих маршрутов
app.use(notFound);

// Подключение обработчика ошибок
app.use(errorHandler);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
