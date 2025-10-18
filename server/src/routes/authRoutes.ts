import express from 'express';
import { acceptTerms, me, googleLogin } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();
router.post('/google-login', googleLogin);

router.get('/me', authMiddleware, me);
router.post('/accept-terms', authMiddleware, acceptTerms);

export default router;
