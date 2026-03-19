import express from 'express';
import { deleteUserController, updatePreferencesController } from '../controllers/userController';
import { validateBody } from '../middlewares/validate';
import { UpdatePreferencesSchema } from '../schemas/userSchemas';

const router = express.Router();

router.patch('/me/preferences', validateBody(UpdatePreferencesSchema), updatePreferencesController);
router.delete('/:userId', deleteUserController);

export default router;
