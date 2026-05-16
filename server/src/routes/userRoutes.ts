import express from 'express';

import { exportLimiter } from '../config/rateLimiters';
import {
  completeOnboardingController,
  deleteUser,
  exportUserDataController,
  updateAnalyticsConsentController,
  updatePreferencesController,
} from '../controllers/userController';
import { validateBody } from '../middlewares/validate';
import {
  CompleteOnboardingSchema,
  DeleteUserSchema,
  UpdateAnalyticsConsentSchema,
  UpdatePreferencesSchema,
} from '../schemas/userSchemas';

const router = express.Router();

router.get('/me/export', exportLimiter, exportUserDataController);
router.patch('/me', validateBody(CompleteOnboardingSchema), completeOnboardingController);
router.patch('/me/preferences', validateBody(UpdatePreferencesSchema), updatePreferencesController);
router.patch(
  '/me/consent',
  validateBody(UpdateAnalyticsConsentSchema),
  updateAnalyticsConsentController
);
router.delete('/:userId', validateBody(DeleteUserSchema), deleteUser);

export default router;
