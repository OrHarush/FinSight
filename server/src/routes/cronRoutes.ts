import { Router } from 'express';

import {
  runBalanceSync,
  runDebugForMe,
  runRecurringTransactions,
} from '../controllers/cronController';
import { requireCronSecret } from '../middlewares/requireCronSecret';

const router = Router();

router.post('/recurring-transactions', requireCronSecret, runRecurringTransactions);
router.post('/sync-balances', requireCronSecret, runBalanceSync);
router.post('/debug-run-for-me', requireCronSecret, runDebugForMe);

export default router;
