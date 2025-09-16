import { Router } from 'express';
import {
  getAccounts,
  createAccount,
  getAccountById,
  updateAccountBalance,
  deleteAccount,
} from '../controllers/accountController';

const router = Router();

router.get('/', getAccounts);
router.post('/', createAccount);
router.get('/:id', getAccountById);
router.put('/:id/balance', updateAccountBalance);
router.delete('/:id', deleteAccount);

export default router;
