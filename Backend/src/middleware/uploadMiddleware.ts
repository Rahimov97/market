import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Устанавливаем путь для сохранения файлов
const uploadPath = path.join(__dirname, '../../uploads');

// Конфигурация для хранения файлов
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    console.log("Destination called for file:", file.originalname);
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    console.log("Generating filename for:", file.originalname);
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

// Фильтрация файлов по типу
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  console.log("Validating file:", file.originalname);
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    console.log("File is valid:", file.originalname);
    cb(null, true);
  } else {
    console.error("Invalid file type:", file.mimetype);
    cb(new Error("Only image files are allowed!"));
  }
};

// Экспорт настроенного multer
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '../../uploads'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
});

export default upload;