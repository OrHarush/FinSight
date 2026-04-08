import express from 'express';

import {
  completeOnboardingController,
  deleteUser,
  updatePreferencesController,
} from '../controllers/userController';
import { validateBody } from '../middlewares/validate';
import { CompleteOnboardingSchema, UpdatePreferencesSchema } from '../schemas/userSchemas';

const router = express.Router();

router.patch('/me', validateBody(CompleteOnboardingSchema), completeOnboardingController);
router.patch('/me/preferences', validateBody(UpdatePreferencesSchema), updatePreferencesController);
router.delete('/:userId', deleteUser);

export default router;
