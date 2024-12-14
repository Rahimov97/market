import express from 'express';
import { uploadSingleFile, uploadMultipleFiles } from '../controllers/upload/uploadController';

const router = express.Router();

// Роут для загрузки одного файла
router.post('/single', uploadSingleFile);

// Роут для загрузки нескольких файлов
router.post('/multiple', uploadMultipleFiles);

export default router;
