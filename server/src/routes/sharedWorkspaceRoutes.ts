import {
  CreateInvitationSchema,
  CreateWorkspaceSchema,
  UpdateWorkspaceSchema,
} from '@lyra/shared';
import { Router } from 'express';

import {
  createInvitation,
  createWorkspace,
  exportWorkspaceData,
  leaveWorkspace,
  listWorkspaces,
  removeMember,
  revokeInvitation,
  updateWorkspace,
} from '../controllers/sharedWorkspaceController';
import { validateBody } from '../middlewares/validate';

const router = Router();

router.get('/', listWorkspaces);
router.post('/', validateBody(CreateWorkspaceSchema), createWorkspace);
router.patch('/:id', validateBody(UpdateWorkspaceSchema), updateWorkspace);
router.post(
  '/:id/invitations',
  validateBody(CreateInvitationSchema),
  createInvitation
);
router.delete('/:id/invitations/:invId', revokeInvitation);
router.post('/:id/leave', leaveWorkspace);
router.delete('/:id/members/:userId', removeMember);
router.get('/:id/export', exportWorkspaceData);

export default router;
