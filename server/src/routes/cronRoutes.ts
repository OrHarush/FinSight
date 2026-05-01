import { Router } from 'express';

import { runRecurringTransactions } from '../controllers/cronController';
import { requireCronSecret } from '../middlewares/requireCronSecret';

const router = Router();

router.post('/recurring-transactions', requireCronSecret, runRecurringTransactions);

export default router;
