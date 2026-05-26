import express from 'express';

import { unsubscribeController } from '../controllers/userController';

const router = express.Router();

router.get('/', unsubscribeController);

export default router;
