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

const isUserMemberOf = async (
  userId: string,
  workspaceId: Types.ObjectId
): Promise<boolean> => {
  const row = await WorkspaceMember.findOne({
    userId: new Types.ObjectId(userId),
    workspaceId,
  })
    .select('_id')
    .lean<{ _id: Types.ObjectId } | null>();

  return !!row;
};

const findPersonalWorkspaceIdForUser = async (
  userId: string
): Promise<Types.ObjectId | null> => {
  const memberRows = await WorkspaceMember.find({ userId: new Types.ObjectId(userId) })
    .select('workspaceId')
    .lean<{ workspaceId: Types.ObjectId }[]>();

  if (memberRows.length === 0) {
    return null;
  }

  const personal = await Workspace.findOne({
    _id: { $in: memberRows.map(row => row.workspaceId) },
    type: 'personal',
  })
    .select('_id')
    .lean<{ _id: Types.ObjectId } | null>();

  return personal?._id ?? null;
};

// Canonical per-request workspace resolver. Runs in middleware on every authenticated request.
// Cheap path: user.activeWorkspaceId set AND membership row exists → return it.
// Fallback path: stale/missing activeWorkspaceId → resolve personal workspace, write back to user.
// Last resort: no personal workspace exists (shouldn't happen post-migration) → create one.
// Future caching candidate: per-user TTL cache; today this is 1–2 indexed lookups per request.
export const resolveWorkspaceForRequest = async (userId: string): Promise<Types.ObjectId> => {
  const user = await User.findById(userId)
    .select('activeWorkspaceId displayCurrency')
    .lean<{ activeWorkspaceId?: Types.ObjectId; displayCurrency?: string } | null>();

  if (!user) {
    throw ApiError.internal(`User ${userId} not found while resolving workspace`);
  }

  if (user.activeWorkspaceId && (await isUserMemberOf(userId, user.activeWorkspaceId))) {
    return user.activeWorkspaceId;
  }

  const personal = await findPersonalWorkspaceIdForUser(userId);

  if (personal) {
    await User.findByIdAndUpdate(userId, { activeWorkspaceId: personal });
    return personal;
  }

  return createPersonalWorkspaceForNewUser(userId, user.displayCurrency);
};
