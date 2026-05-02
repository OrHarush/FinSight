import { CreateTransactionSchema, UpdateTransactionSchema } from '@lyra/shared';
import { Router } from 'express';

import {
  createTransaction,
  deleteTransaction,
  exportTransactions,
  getQuickChips,
  getTransactionById,
  getTransactionCount,
  getTransactions,
  getTransactionSummary,
  updateTransaction,
} from '../controllers/transactionController';
import { validateBody, validateQuery } from '../middlewares/validate';
import { ExportTransactionsSchema } from '../schemas/transactionExportSchemas';
import { GetTransactionsSchema, GetTransactionSummarySchema } from '../schemas/transactionSchemas';

const router = Router();

router.get('/count', getTransactionCount);
router.get('/quick-chips', getQuickChips);
router.get('/export', validateQuery(ExportTransactionsSchema), exportTransactions);
router.get('/summary', validateQuery(GetTransactionSummarySchema), getTransactionSummary);
router.get('/', validateQuery(GetTransactionsSchema), getTransactions);
router.get('/:id', getTransactionById);
router.post('/', validateBody(CreateTransactionSchema), createTransaction);
router.put('/:id', validateBody(UpdateTransactionSchema), updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
