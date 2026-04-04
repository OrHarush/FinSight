import { NextFunction, Request, Response, Router } from 'express';
import multer, { MulterError } from 'multer';

import { getImportPreview, importTransactions } from '../controllers/importController';
import { ApiError } from '../errors/ApiError';
import { validateBody } from '../middlewares/validate';
import { ImportTransactionsSchema } from '../schemas/importSchemas';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/csv',
      'text/plain',
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        ApiError.badRequest(
          `Unsupported file type: ${file.mimetype}. Only xlsx and csv files are accepted.`
        )
      );
    }
  },
});

const multerErrorHandler = (
  err: unknown,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(ApiError.badRequest('File exceeds the 5MB size limit.'));
    }

    return next(ApiError.badRequest(`Upload error: ${err.message}`));
  }

  // Busboy throws a plain Error when the multipart boundary is missing —
  // this happens when the client sets Content-Type: multipart/form-data manually
  // without the boundary parameter (e.g. Postman with a manually-added header).
  if (err instanceof Error && err.message.toLowerCase().includes('boundary not found')) {
    return next(
      ApiError.badRequest(
        'Malformed multipart request: boundary not found. ' +
          'Do not set Content-Type manually — let your HTTP client set it automatically.'
      )
    );
  }

  return next(err);
};

const router = Router();

router.post('/preview', upload.single('file'), multerErrorHandler, getImportPreview);
router.post('/transactions', validateBody(ImportTransactionsSchema), importTransactions);

export default router;
