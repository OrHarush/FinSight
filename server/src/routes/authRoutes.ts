import express from 'express';

import { acceptTerms, devLogin, googleLogin, me } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
router.post('/google-login', googleLogin);

if (process.env.DEV_AUTH_BYPASS === 'true') {
  router.post('/dev-login', devLogin);
}

router.get('/me', authMiddleware, me);
router.post('/accept-terms', authMiddleware, acceptTerms);

export default router;
