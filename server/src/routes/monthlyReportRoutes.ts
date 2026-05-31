import express from 'express';

import { getEligibility, markSeen } from '../controllers/monthlyReportController';

const router = express.Router();

router.get('/eligibility', getEligibility);
router.patch('/seen', markSeen);

export default router;
