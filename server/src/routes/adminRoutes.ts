import { Router } from 'express';

import { getAnalytics, getKpiOverview, getLoginEvents } from '../controllers/adminController';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/overview', requireAdmin, getKpiOverview);
router.get('/activity', requireAdmin, getLoginEvents);
router.get('/analytics', requireAdmin, getAnalytics);

export default router;
