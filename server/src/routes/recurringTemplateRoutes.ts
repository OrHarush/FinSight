import {
  CreateRecurringTemplateSchema,
  DeactivateFromSchema,
  SplitRecurringTemplateSchema,
  UpdateRecurringTemplateSchema,
} from '@finsight/shared';
import { Router } from 'express';

import {
  createTemplate,
  createTemplateWithTransactions,
  deactivateFrom,
  deleteTemplate,
  getTemplateById,
  getTemplates,
  splitTemplate,
  updateTemplate,
} from '../controllers/recurringTemplateController';
import { validateBody } from '../middlewares/validate';

const router = Router();

router.get('/', getTemplates);
router.get('/:id', getTemplateById);
router.post(
  '/with-transactions',
  validateBody(CreateRecurringTemplateSchema),
  createTemplateWithTransactions,
);
router.post('/', validateBody(CreateRecurringTemplateSchema), createTemplate);
router.post('/:id/deactivate-from', validateBody(DeactivateFromSchema), deactivateFrom);
router.put('/:id/split', validateBody(SplitRecurringTemplateSchema), splitTemplate);
router.put('/:id', validateBody(UpdateRecurringTemplateSchema), updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
