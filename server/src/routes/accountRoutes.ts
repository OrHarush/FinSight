import { Router } from 'express';
import {
  getAccounts,
  createAccount,
  getAccountById,
  deleteAccount,
  updateAccount,
  setPrimaryAccount,
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
router.patch('/:id/primary', setPrimaryAccount);
router.delete('/:id', deleteAccount);

export default router;
