import { Router } from 'express';

import { shortcutPollLimiter } from '../config/rateLimiters';
import {
  approveShortcut,
  createShortcutTransaction,
  getShortcutCategories,
  getShortcutStatus,
  getShortcutToken,
  initShortcut,
  revokeShortcut,
} from '../controllers/shortcutController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { shortcutAuthMiddleware } from '../middlewares/shortcutAuthMiddleware';
import { validateBody } from '../middlewares/validate';
import { ApproveSchema, ShortcutTransactionSchema } from '../schemas/shortcutSchemas';

const router = Router();

router.post('/init', authMiddleware, initShortcut);
router.post('/approve', authMiddleware, validateBody(ApproveSchema), approveShortcut);
router.get('/token', shortcutPollLimiter, getShortcutToken);
router.get('/status', shortcutAuthMiddleware, getShortcutStatus);
router.delete('/revoke', authMiddleware, revokeShortcut);
router.get('/categories', shortcutAuthMiddleware, getShortcutCategories);
router.post(
  '/transaction',
  shortcutAuthMiddleware,
  validateBody(ShortcutTransactionSchema),
  createShortcutTransaction
);

export default router;
