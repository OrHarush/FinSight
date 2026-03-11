import { Router } from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  createBudgetBulk,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController';
import { validateBody, validateQuery } from '../middlewares/validate';
import {
  GetBudgetsSchema,
  CreateBudgetSchema,
  CreateBudgetBulkSchema,
  UpdateBudgetSchema,
} from '../schemas/budgetSchemas';

const router = Router();

router.get('/', validateQuery(GetBudgetsSchema), getBudgets);
router.post('/bulk', validateBody(CreateBudgetBulkSchema), createBudgetBulk);
router.get('/:id', getBudgetById);
router.post('/', validateBody(CreateBudgetSchema), createBudget);
router.put('/:id', validateBody(UpdateBudgetSchema), updateBudget);
router.delete('/:id', deleteBudget);

export default router;
