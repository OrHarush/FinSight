import express from 'express';

import { trackShareClickController } from '../controllers/analyticsController';
import { validateBody } from '../middlewares/validate';
import { ShareClickSchema } from '../schemas/analyticsSchemas';

const router = express.Router();

router.post('/share-click', validateBody(ShareClickSchema), trackShareClickController);

export default router;
