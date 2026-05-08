import {
  CreateGoalSchema,
  DeleteGoalQuerySchema,
  GetGhostsQuerySchema,
  GetGoalsQuerySchema,
  UpdateGoalSchema,
} from '@lyra/shared';
import { Router } from 'express';

import {
  createGoal,
  deleteGoal,
  getGhostContributions,
  getGoalById,
  getGoalProjection,
  getGoals,
  updateGoal,
} from '../controllers/goalController';
import { validateBody, validateQuery } from '../middlewares/validate';

const router = Router();

router.get('/', validateQuery(GetGoalsQuerySchema), getGoals);
router.get('/ghosts', validateQuery(GetGhostsQuerySchema), getGhostContributions);
router.get('/:id/projection', getGoalProjection);
router.get('/:id', getGoalById);
router.post('/', validateBody(CreateGoalSchema), createGoal);
router.patch('/:id', validateBody(UpdateGoalSchema), updateGoal);
router.delete('/:id', validateQuery(DeleteGoalQuerySchema), deleteGoal);

export default router;
