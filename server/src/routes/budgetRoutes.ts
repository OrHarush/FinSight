import { Router } from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  createBudgetBulk,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController';

const router = Router();

router.get('/', getBudgets);
router.post('/bulk', createBudgetBulk);
router.get('/:id', getBudgetById);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
