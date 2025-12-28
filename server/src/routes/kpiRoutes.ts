import { Router } from 'express';
import { getKpiOverview } from '../controllers/kpiController';
import { requireAdmin } from '../middlewares/requireAdmin';

const router = Router();

router.get('/overview', requireAdmin, getKpiOverview);

export default router;
