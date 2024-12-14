import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

import connectDB from './config/db';
import productRoutes from './routes/productRoutes';
import sellerRoutes from './routes/sellerRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler, notFound } from './middleware/errorMiddleware';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/products', productRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
