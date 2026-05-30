import { CreateInvitationDTO, CreateWorkspaceDTO, UpdateWorkspaceDTO } from '@lyra/shared';
import crypto from 'crypto';
import mongoose, { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { IWorkspace } from '../models/Workspace';
import { IWorkspaceInvitation } from '../models/WorkspaceInvitation';
import { IWorkspaceMember } from '../models/WorkspaceMember';
import * as userRepository from '../repositories/userRepository';
import * as workspaceInvitationRepository from '../repositories/workspaceInvitationRepository';
import * as workspaceMemberRepository from '../repositories/workspaceMemberRepository';
import * as workspaceRepository from '../repositories/workspaceRepository';
import * as analyticsService from './analyticsService';
import * as emailService from './emailService';
import { createDefaultEntitiesForNewUser } from './userService';
import {
  leaveSharedWorkspaceTx,
  removeMemberFromWorkspaceTx,
} from './workspaceLifecycleService';

export const MAX_WORKSPACES_PER_USER = 5;
export const MAX_WORKSPACE_MEMBERS = 2;
const INVITATION_EXPIRY_DAYS = 7;
const DEFAULT_CURRENCY = 'ILS';

const isExpired = (invitation: IWorkspaceInvitation) =>
  invitation.expiresAt instanceof Date
    ? invitation.expiresAt.getTime() < Date.now()
    : new Date(invitation.expiresAt).getTime() < Date.now();

const effectiveStatus = (invitation: IWorkspaceInvitation) => {
  if (invitation.status === 'pending' && isExpired(invitation)) {
    return 'expired' as const;
  }

  return invitation.status;
};

const assertMembership = async (workspaceId: string, userId: string) => {
  const member = await workspaceMemberRepository.findOne(workspaceId, userId);

  if (!member) {
    throw ApiError.forbidden('NOT_MEMBER');
  }

  return member;
};

export interface WorkspaceMemberView {
  userId: string;
  name: string;
  email: string;
  role: IWorkspaceMember['role'];
}

export interface PendingInvitationView {
  _id: string;
  invitedEmail: string;
  expiresAt: Date;
}

export interface WorkspaceListItem {
  workspace: IWorkspace;
  role: IWorkspaceMember['role'];
  memberCount: number;
  members: WorkspaceMemberView[];
  pendingInvitations: PendingInvitationView[];
}

export const createSharedWorkspace = async (userId: string, dto: CreateWorkspaceDTO) => {
  const userWorkspaceCount = await workspaceMemberRepository.countByUser(userId);

  if (userWorkspaceCount >= MAX_WORKSPACES_PER_USER) {
    throw ApiError.badRequest('WORKSPACE_CAP_REACHED');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  let workspace;

  try {
    workspace = await workspaceRepository.insert(
      {
        name: dto.name,
        type: 'shared',
        currency: dto.currency ?? DEFAULT_CURRENCY,
        icon: dto.icon ?? 'Home',
        color: dto.color ?? '#9ca3af',
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

    await createDefaultEntitiesForNewUser(userId, workspaceId, session);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }

  void analyticsService
    .track(userId, 'workspace_created')
    .catch(err => console.error('Failed to track workspace_created:', err));

  return {
    _id: (workspace._id as unknown as Types.ObjectId).toString(),
    name: workspace.name,
    type: workspace.type,
    currency: workspace.currency,
    icon: workspace.icon,
    color: workspace.color,
    role: 'owner' as const,
    memberCount: 1,
  };
};

export const updateWorkspace = async (
  userId: string,
  workspaceId: string,
  dto: UpdateWorkspaceDTO
) => {
  if (!Types.ObjectId.isValid(workspaceId)) {
    throw ApiError.badRequest('Invalid workspace ID');
  }

  await assertMembership(workspaceId, userId);

  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw ApiError.notFound('WORKSPACE_NOT_FOUND');
  }

  const patch: Partial<IWorkspace> = {};

  if (dto.name !== undefined) {
    patch.name = dto.name;
  }

  if (dto.icon !== undefined) {
    patch.icon = dto.icon;
  }

  if (dto.color !== undefined) {
    patch.color = dto.color;
  }

  const updated = await workspaceRepository.updateById(workspaceId, patch);

  if (!updated) {
    throw ApiError.internal('Failed to update workspace');
  }

  return updated;
};

const presentMember = async (member: IWorkspaceMember): Promise<WorkspaceMemberView | null> => {
  const user = await userRepository.findById(member.userId);

  if (!user) {
    return null;
  }

  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: member.role,
  };
};

const buildWorkspaceListItem = async (
  row: IWorkspaceMember,
  workspace: IWorkspace
): Promise<WorkspaceListItem> => {
  const [memberRows, pending] = await Promise.all([
    workspaceMemberRepository.findByWorkspace(row.workspaceId),
    workspaceInvitationRepository.findPendingForWorkspace(row.workspaceId),
  ]);

  const memberViews = await Promise.all(memberRows.map(presentMember));
  const members = memberViews.filter((m): m is WorkspaceMemberView => m !== null);

  const pendingInvitations: PendingInvitationView[] = pending
    .filter(inv => !isExpired(inv))
    .map(inv => ({
      _id: inv._id.toString(),
      invitedEmail: inv.invitedEmail,
      expiresAt: inv.expiresAt,
    }));

  return {
    workspace,
    role: row.role,
    memberCount: members.length,
    members,
    pendingInvitations,
  };
};

export const listMyWorkspaces = async (userId: string): Promise<WorkspaceListItem[]> => {
  const memberRows = await workspaceMemberRepository.findByUser(userId);

  if (memberRows.length === 0) {
    return [];
  }

  const workspaceIds = memberRows.map(row => row.workspaceId);
  const workspaces = await workspaceRepository.findManyByIds(workspaceIds);
  const workspacesById = new Map(workspaces.map(w => [w._id.toString(), w]));

  const items = await Promise.all(
    memberRows.map(async row => {
      const workspace = workspacesById.get(row.workspaceId.toString());

      if (!workspace) {
        return null;
      }

      return buildWorkspaceListItem(row, workspace);
    })
  );

  return items.filter((it): it is WorkspaceListItem => it !== null);
};

const generateToken = () => crypto.randomBytes(32).toString('hex');

export const createInvitation = async (
  inviterUserId: string,
  workspaceId: string,
  dto: CreateInvitationDTO
) => {
  if (!Types.ObjectId.isValid(workspaceId)) {
    throw ApiError.badRequest('Invalid workspace ID');
  }

  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw ApiError.notFound('WORKSPACE_NOT_FOUND');
  }

  await assertMembership(workspaceId, inviterUserId);

  const inviter = await userRepository.findById(inviterUserId);

  if (!inviter) {
    throw ApiError.internal('Inviter user not found');
  }

  if (inviter.email.toLowerCase() === dto.invitedEmail) {
    throw ApiError.badRequest('SELF_INVITE');
  }

  const existingMemberUser = await userRepository.findByEmail(dto.invitedEmail);

  if (existingMemberUser) {
    const alreadyMember = await workspaceMemberRepository.findOne(
      workspaceId,
      existingMemberUser._id.toString()
    );

    if (alreadyMember) {
      throw ApiError.badRequest('ALREADY_MEMBER');
    }
  }

  const existingPending = await workspaceInvitationRepository.findPendingByEmail(
    workspaceId,
    dto.invitedEmail
  );

  if (existingPending && !isExpired(existingPending)) {
    throw ApiError.badRequest('ALREADY_INVITED');
  }

  const memberCount = await workspaceMemberRepository.countByWorkspace(workspaceId);
  const pendingCount = await workspaceInvitationRepository.countPendingForWorkspace(workspaceId);

  if (memberCount + pendingCount >= MAX_WORKSPACE_MEMBERS) {
    throw ApiError.badRequest('MEMBER_CAP_REACHED');
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  const invitation = await workspaceInvitationRepository.insert({
    workspaceId: new Types.ObjectId(workspaceId),
    invitedEmail: dto.invitedEmail,
    invitedBy: new Types.ObjectId(inviterUserId),
    token,
    status: 'pending',
    expiresAt,
  });

  const emailResult = await emailService.sendWorkspaceInvitation({
    to: dto.invitedEmail,
    inviterName: inviter.name,
    workspaceName: workspace.name,
    workspaceIcon: workspace.icon,
    token,
  });

  void analyticsService
    .track(inviterUserId, 'invitation_sent')
    .catch(err => console.error('Failed to track invitation_sent:', err));

  return {
    _id: invitation._id.toString(),
    workspaceId: workspaceId,
    invitedEmail: invitation.invitedEmail,
    token,
    expiresAt: invitation.expiresAt,
    emailSent: emailResult.delivered,
    emailError: emailResult.reason,
  };
};

export interface InvitationPublicView {
  workspaceName: string;
  workspaceColor?: string;
  inviterName: string;
  inviterPicture?: string;
  invitedEmail: string;
  status: ReturnType<typeof effectiveStatus>;
  expiresAt: Date;
}

export const getInvitationPublic = async (token: string): Promise<InvitationPublicView> => {
  const invitation = await workspaceInvitationRepository.findByToken(token);

  if (!invitation) {
    throw ApiError.notFound('INVITATION_NOT_FOUND');
  }

  const [workspace, inviter] = await Promise.all([
    workspaceRepository.findById(invitation.workspaceId),
    userRepository.findById(invitation.invitedBy),
  ]);

  if (!workspace || !inviter) {
    throw ApiError.notFound('INVITATION_NOT_FOUND');
  }

  return {
    workspaceName: workspace.name,
    workspaceColor: workspace.color,
    inviterName: inviter.name,
    inviterPicture: inviter.picture,
    invitedEmail: invitation.invitedEmail,
    status: effectiveStatus(invitation),
    expiresAt: invitation.expiresAt,
  };
};

const requireActionableInvitation = async (token: string, actingUserId: string) => {
  const invitation = await workspaceInvitationRepository.findByToken(token);

  if (!invitation) {
    throw ApiError.notFound('INVITATION_NOT_FOUND');
  }

  if (invitation.status !== 'pending') {
    throw ApiError.badRequest('INVITATION_NOT_PENDING');
  }

  if (isExpired(invitation)) {
    throw ApiError.badRequest('INVITATION_EXPIRED');
  }

  const user = await userRepository.findById(actingUserId);

  if (!user) {
    throw ApiError.internal('Acting user not found');
  }

  if (user.email.toLowerCase() !== invitation.invitedEmail) {
    throw ApiError.forbidden('EMAIL_MISMATCH');
  }

  return { invitation, user };
};

export const acceptInvitation = async (userId: string, token: string) => {
  const { invitation } = await requireActionableInvitation(token, userId);

  const userWorkspaceCount = await workspaceMemberRepository.countByUser(userId);

  if (userWorkspaceCount >= MAX_WORKSPACES_PER_USER) {
    throw ApiError.badRequest('WORKSPACE_CAP_REACHED');
  }

  const memberCount = await workspaceMemberRepository.countByWorkspace(invitation.workspaceId);

  if (memberCount >= MAX_WORKSPACE_MEMBERS) {
    throw ApiError.badRequest('MEMBER_CAP_REACHED');
  }

  await workspaceMemberRepository.insert({
    workspaceId: invitation.workspaceId,
    userId: new Types.ObjectId(userId),
    role: 'member',
    invitedBy: invitation.invitedBy,
    joinedAt: new Date(),
  });

  await workspaceInvitationRepository.updateStatusById(invitation._id.toString(), {
    status: 'accepted',
    acceptedByUserId: new Types.ObjectId(userId),
  });

  void analyticsService
    .track(userId, 'invitation_accepted')
    .catch(err => console.error('Failed to track invitation_accepted:', err));

  return { workspaceId: invitation.workspaceId.toString() };
};

export const declineInvitation = async (userId: string, token: string) => {
  const { invitation } = await requireActionableInvitation(token, userId);

  await workspaceInvitationRepository.updateStatusById(invitation._id.toString(), {
    status: 'declined',
  });

  return { ok: true };
};

export const revokeInvitation = async (
  userId: string,
  workspaceId: string,
  invitationId: string
) => {
  if (!Types.ObjectId.isValid(workspaceId) || !Types.ObjectId.isValid(invitationId)) {
    throw ApiError.badRequest('Invalid ID');
  }

  await assertMembership(workspaceId, userId);

  const invitation = await workspaceInvitationRepository.findById(invitationId);

  if (!invitation || invitation.workspaceId.toString() !== workspaceId) {
    throw ApiError.notFound('INVITATION_NOT_FOUND');
  }

  if (invitation.status !== 'pending') {
    throw ApiError.badRequest('INVITATION_NOT_PENDING');
  }

  await workspaceInvitationRepository.updateStatusById(invitationId, { status: 'revoked' });

  return { ok: true };
};

export const leaveWorkspace = async (
  userId: string,
  workspaceId: string
): Promise<{ deleted: boolean }> => {
  if (!Types.ObjectId.isValid(workspaceId)) {
    throw ApiError.badRequest('Invalid workspace ID');
  }

  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw ApiError.notFound('WORKSPACE_NOT_FOUND');
  }

  if (workspace.type === 'personal') {
    throw ApiError.badRequest('CANNOT_LEAVE_PERSONAL');
  }

  const workspaceObjectId = new Types.ObjectId(workspaceId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await leaveSharedWorkspaceTx(userId, workspaceObjectId, session);

    await session.commitTransaction();

    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

export const removeMember = async (
  callerUserId: string,
  workspaceId: string,
  targetUserId: string
): Promise<{ ok: true }> => {
  if (!Types.ObjectId.isValid(workspaceId) || !Types.ObjectId.isValid(targetUserId)) {
    throw ApiError.badRequest('Invalid ID');
  }

  if (callerUserId === targetUserId) {
    throw ApiError.badRequest('CANNOT_REMOVE_SELF');
  }

  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw ApiError.notFound('WORKSPACE_NOT_FOUND');
  }

  if (workspace.type === 'personal') {
    throw ApiError.badRequest('CANNOT_REMOVE_FROM_PERSONAL');
  }

  const callerMember = await workspaceMemberRepository.findOne(workspaceId, callerUserId);

  if (!callerMember || callerMember.role !== 'owner') {
    throw ApiError.forbidden('NOT_OWNER');
  }

  const targetMember = await workspaceMemberRepository.findOne(workspaceId, targetUserId);

  if (!targetMember) {
    throw ApiError.notFound('TARGET_NOT_MEMBER');
  }

  const targetUser = await userRepository.findById(targetUserId);
  const workspaceObjectId = new Types.ObjectId(workspaceId);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await removeMemberFromWorkspaceTx(workspaceObjectId, targetUserId, session);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }

  if (targetUser?.email) {
    void emailService
      .sendWorkspaceRemovalNotification({
        to: targetUser.email,
        workspaceName: workspace.name,
      })
      .catch(err => console.error('Failed to send workspace removal email:', err));
  }

  return { ok: true };
};
