import { Router } from 'express';

import {
  getAllUsers,
  getAnalytics,
  getBalanceBreakdown,
  getDebugSnapshots,
  getKpiOverview,
  getLoginEvents,
  getRecentActivity,
  getRetention,
  getSnapshot,
  restoreDebugForMe,
  runDebugForMe,
} from '../controllers/adminController';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/overview', requireAdmin, getKpiOverview);
router.get('/activity', requireAdmin, getLoginEvents);
router.get('/analytics', requireAdmin, getAnalytics);
router.get('/analytics/activity', requireAdmin, getRecentActivity);
router.get('/retention', requireAdmin, getRetention);
router.get('/snapshot', requireAdmin, getSnapshot);
router.get('/users', requireAdmin, getAllUsers);

router.post('/debug/run-for-me', requireAdmin, runDebugForMe);
router.post('/debug/restore-for-me', requireAdmin, restoreDebugForMe);
router.get('/debug/snapshots', requireAdmin, getDebugSnapshots);
router.get('/debug/balance-breakdown', requireAdmin, getBalanceBreakdown);

export default router;
