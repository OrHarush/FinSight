import { Router } from 'express';
import {
  getAccounts,
  createAccount,
  getAccountById,
  deleteAccount,
  updateAccount,
} from '../controllers/accountController';

const router = Router();

router.get('/', getAccounts);
router.post('/', createAccount);
router.get('/:id', getAccountById);
router.put('/:id', updateAccount);
router.delete('/:id', deleteAccount);

export default router;
