import { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import User from '../models/User';
import Workspace from '../models/Workspace';
import WorkspaceMember from '../models/WorkspaceMember';

const PERSONAL_WORKSPACE_NAME = 'האישי שלי';
const DEFAULT_CURRENCY = 'ILS';

export const getActiveWorkspaceIdOrThrow = async (userId: string): Promise<Types.ObjectId> => {
  const user = await User.findById(userId)
    .select('activeWorkspaceId')
    .lean<{ activeWorkspaceId?: Types.ObjectId } | null>();

  if (!user?.activeWorkspaceId) {
    throw ApiError.internal(
      `User ${userId} has no activeWorkspaceId — workspace migration has not run for this user`
    );
  }

  return user.activeWorkspaceId;
};

export const createPersonalWorkspaceForNewUser = async (
  userId: string,
  currency?: string
): Promise<Types.ObjectId> => {
  const workspace = await Workspace.create({
    name: PERSONAL_WORKSPACE_NAME,
    type: 'personal',
    currency: currency ?? DEFAULT_CURRENCY,
  });

  const workspaceId = workspace._id as unknown as Types.ObjectId;

  await WorkspaceMember.create({
    workspaceId,
    userId: new Types.ObjectId(userId),
    role: 'owner',
    joinedAt: new Date(),
  });

  await User.findByIdAndUpdate(userId, { activeWorkspaceId: workspaceId });

  return workspaceId;
};
