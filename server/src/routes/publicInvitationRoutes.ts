import { Router } from 'express';

import { getInvitationByToken } from '../controllers/sharedWorkspaceController';

const router = Router();

// Public landing-page endpoint — fetched by a logged-out user clicking the email link.
router.get('/:token', getInvitationByToken);

export default router;
