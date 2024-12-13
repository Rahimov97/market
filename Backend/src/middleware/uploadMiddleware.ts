import multer from 'multer';
import path from 'path';

// Устанавливаем путь для сохранения файлов
const uploadPath = path.join(__dirname, '../uploads');

// Конфигурация для хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Папка для сохранения
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix);
  },
});

// Фильтрация файлов по типу
const fileFilter = (req: any, file: any, cb: any) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Экспорт настроенного multer
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Лимит 5MB
  fileFilter,
});

export default upload;
