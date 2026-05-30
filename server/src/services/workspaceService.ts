import mongoose, { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import User from '../models/User';
import Workspace from '../models/Workspace';
import WorkspaceMember from '../models/WorkspaceMember';
import * as userRepository from '../repositories/userRepository';
import * as workspaceMemberRepository from '../repositories/workspaceMemberRepository';
import * as workspaceRepository from '../repositories/workspaceRepository';

const PERSONAL_WORKSPACE_NAME = 'האישי שלי';
const PERSONAL_WORKSPACE_ICON = 'Person';
const PERSONAL_WORKSPACE_COLOR = '#534AB7';
const DEFAULT_CURRENCY = 'ILS';

// Membership-verifying resolver for non-HTTP entry points (MCP, chat, import, balance sync,
// completeOnboarding, user export). Mirrors `resolveWorkspaceForRequest` so a stale
// `user.activeWorkspaceId` (e.g. pointing at a workspace the user was removed from) can never
// silently leak that workspace's data. Falls back to the user's personal workspace.
export const getActiveWorkspaceIdOrThrow = async (userId: string): Promise<Types.ObjectId> =>
  resolveWorkspaceForRequest(userId);

export const createPersonalWorkspaceForNewUser = async (
  userId: string,
  currency?: string,
  session?: mongoose.ClientSession
): Promise<Types.ObjectId> => {
  const workspace = await workspaceRepository.insert(
    {
      name: PERSONAL_WORKSPACE_NAME,
      type: 'personal',
      currency: currency ?? DEFAULT_CURRENCY,
      icon: PERSONAL_WORKSPACE_ICON,
      color: PERSONAL_WORKSPACE_COLOR,
    },
    session
  );

  const workspaceId = workspace._id as unknown as Types.ObjectId;

  await workspaceMemberRepository.insert(
    {
      workspaceId,
      userId: new Types.ObjectId(userId),
      role: 'owner',
      joinedAt: new Date(),
    },
    session
  );

  await userRepository.updateActiveWorkspace(userId, workspaceId, session);

  return workspaceId;
};

export const isUserMemberOf = async (
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

export const findPersonalWorkspaceIdForUser = async (
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

export const setActiveWorkspace = async (
  userId: string,
  workspaceId: string
): Promise<{ activeWorkspaceId: string }> => {
  if (!Types.ObjectId.isValid(workspaceId)) {
    throw ApiError.badRequest('Invalid workspace ID');
  }

  const workspaceObjectId = new Types.ObjectId(workspaceId);
  const isMember = await isUserMemberOf(userId, workspaceObjectId);

  if (!isMember) {
    throw ApiError.forbidden('NOT_MEMBER');
  }

  await User.findByIdAndUpdate(userId, { activeWorkspaceId: workspaceObjectId });

  return { activeWorkspaceId: workspaceId };
};
