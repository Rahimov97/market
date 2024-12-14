import { Request, Response, NextFunction } from 'express';
import upload from '../../middleware/uploadMiddleware';

// Обработчик загрузки одного файла
export const uploadSingleFile = (req: Request, res: Response, next: NextFunction): void => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded.' });
      return;
    }

    res.status(200).json({
      message: 'File uploaded successfully!',
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  });
};

// Обработчик загрузки нескольких файлов
export const uploadMultipleFiles = (req: Request, res: Response, next: NextFunction): void => {
  upload.array('files', 5)(req, res, (err: any) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      res.status(400).json({ message: 'No files uploaded.' });
      return;
    }

    res.status(200).json({
      message: 'Files uploaded successfully!',
      files: (req.files as Express.Multer.File[]).map((file) => ({
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
      })),
    });
  });
};
