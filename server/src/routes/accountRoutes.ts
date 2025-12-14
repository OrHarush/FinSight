import { Router } from 'express';
import {
  getAccounts,
  createAccount,
  getAccountById,
  deleteAccount,
  updateAccount,
  getLinkedTransactionsCount,
  getAccountBalanceCurve,
  syncAccountBalance,
} from '../controllers/accountController';

const router = Router();

router.get('/', getAccounts);
router.get('/:id', getAccountById);
router.get('/:id/linked-transactions', getLinkedTransactionsCount);
router.get('/:id/balance-curve', getAccountBalanceCurve);
router.post('/:id/sync-balance', syncAccountBalance);
router.post('/', createAccount);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;
