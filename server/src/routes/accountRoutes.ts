import { CreateAccountSchema, UpdateAccountSchema } from '@finsight/shared';
import { Router } from 'express';

import {
  createAccount,
  deleteAccount,
  getAccountBalanceCurve,
  getAccountById,
  getAccounts,
  getLinkedTransactionsCount,
  setPrimaryAccount,
  syncAccountBalance,
  updateAccount,
} from '../controllers/accountController';
import { validateBody } from '../middlewares/validate';

const router = Router();

router.get('/', getAccounts);
router.get('/:id', getAccountById);
router.get('/:id/linked-transactions', getLinkedTransactionsCount);
router.get('/:id/balance-curve', getAccountBalanceCurve);
router.post('/:id/sync-balance', syncAccountBalance);
router.post('/', validateBody(CreateAccountSchema), createAccount);
router.put('/:id', validateBody(UpdateAccountSchema), updateAccount);
router.patch('/:id/primary', setPrimaryAccount);
router.delete('/:id', deleteAccount);

export default router;
