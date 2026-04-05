import {
  CreateBudgetBulkSchema,
  CreateBudgetSchema,
  GetBudgetsSchema,
  UpdateBudgetSchema,
} from '@lyra/shared';
import { Router } from 'express';

import {
  createBudget,
  createBudgetBulk,
  deleteBudget,
  getBudgetById,
  getBudgets,
  updateBudget,
} from '../controllers/budgetController';
import { validateBody, validateQuery } from '../middlewares/validate';

const router = Router();

router.get('/', validateQuery(GetBudgetsSchema), getBudgets);
router.post('/bulk', validateBody(CreateBudgetBulkSchema), createBudgetBulk);
router.get('/:id', getBudgetById);
router.post('/', validateBody(CreateBudgetSchema), createBudget);
router.put('/:id', validateBody(UpdateBudgetSchema), updateBudget);
router.delete('/:id', deleteBudget);

export default router;
