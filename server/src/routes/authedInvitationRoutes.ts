import { Router } from 'express';

import {
  acceptInvitation,
  declineInvitation,
} from '../controllers/sharedWorkspaceController';

const router = Router();

router.post('/:token/accept', acceptInvitation);
router.post('/:token/decline', declineInvitation);

export default router;
