import { Router } from 'express';

import { backupLimiter } from '../config/rateLimiters';
import {
  deleteDebugSnapshot,
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
import { downloadFullBackupController } from '../controllers/backupController';
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
router.delete('/debug/snapshots/:id', requireAdmin, deleteDebugSnapshot);
router.get('/debug/balance-breakdown', requireAdmin, getBalanceBreakdown);

if (process.env.ENABLE_DB_BACKUP === 'true') {
  router.get('/backup', requireAdmin, backupLimiter, downloadFullBackupController);
}

export default router;
