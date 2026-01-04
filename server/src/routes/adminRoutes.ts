import { Router } from 'express';
import { getKpiOverview, getLoginEvents } from '../controllers/adminController';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/overview', requireAdmin, getKpiOverview);
router.get('/activity', requireAdmin, getLoginEvents);

export default router;
