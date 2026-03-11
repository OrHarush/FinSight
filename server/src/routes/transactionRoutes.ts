import { Router } from 'express';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getTransactionCount,
} from '../controllers/transactionController';
import { validateQuery } from '../middlewares/validate';
import { GetTransactionsSchema, GetTransactionSummarySchema } from '../schemas/transactionSchemas';

const router = Router();

router.get('/count', getTransactionCount);
router.get('/summary', validateQuery(GetTransactionSummarySchema), getTransactionSummary);
router.get('/', validateQuery(GetTransactionsSchema), getTransactions);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
