import { ClientSession, Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { IWorkspaceMember } from '../models/WorkspaceMember';
import * as accountRepository from '../repositories/accountRepository';
import * as budgetRepository from '../repositories/budgetRepository';
import * as categoryRepository from '../repositories/categoryRepository';
import * as goalRepository from '../repositories/goalRepository';
import * as paymentMethodRepository from '../repositories/paymentMethodRepository';
import * as recurringTemplateRepository from '../repositories/recurringTemplateRepository';
import * as transactionRepository from '../repositories/transactionRepository';
import * as userRepository from '../repositories/userRepository';
import * as workspaceInvitationRepository from '../repositories/workspaceInvitationRepository';
import * as workspaceMemberRepository from '../repositories/workspaceMemberRepository';
import * as workspaceRepository from '../repositories/workspaceRepository';
import { findPersonalWorkspaceIdForUser } from './workspaceService';

export const deleteWorkspaceCompletely = async (
  workspaceId: string | Types.ObjectId,
  session: ClientSession
): Promise<void> => {
  const workspaceObjectId = new Types.ObjectId(workspaceId.toString());
  const filter = { workspaceId: workspaceObjectId };

  await transactionRepository.deleteMany(filter, session);
  await recurringTemplateRepository.deleteMany(filter, session);
  await budgetRepository.deleteMany(filter, session);
  await goalRepository.deleteMany(filter, session);
  await accountRepository.deleteMany(filter, session);
  await categoryRepository.deleteMany(filter, session);
  await paymentMethodRepository.deleteMany(filter, session);
  await workspaceInvitationRepository.deleteMany(filter, session);
  await workspaceMemberRepository.deleteMany(filter, session);
  await workspaceRepository.deleteById(workspaceObjectId, session);
};

const findEarliestRemainingMember = (
  members: IWorkspaceMember[],
  excludingUserId: string
): IWorkspaceMember | null => {
  const remaining = members.filter(m => m.userId.toString() !== excludingUserId);

  if (remaining.length === 0) {
    return null;
  }

  return remaining.reduce((earliest, candidate) =>
    candidate.joinedAt.getTime() < earliest.joinedAt.getTime() ? candidate : earliest
  );
};

const resetActiveWorkspaceIfMatches = async (
  userId: string,
  leftWorkspaceId: Types.ObjectId,
  session: ClientSession
): Promise<void> => {
  const user = await userRepository.findById(userId);

  if (!user || user.activeWorkspaceId?.toString() !== leftWorkspaceId.toString()) {
    return;
  }

  const personal = await findPersonalWorkspaceIdForUser(userId);

  await userRepository.updateActiveWorkspace(userId, personal, session);
};

export const leaveSharedWorkspaceTx = async (
  userId: string,
  workspaceId: Types.ObjectId,
  session: ClientSession
): Promise<{ deleted: boolean }> => {
  const callerMember = await workspaceMemberRepository.findOne(workspaceId, userId);

  if (!callerMember) {
    throw ApiError.forbidden('NOT_MEMBER');
  }

  const allMembers = await workspaceMemberRepository.findByWorkspace(workspaceId);
  const isLastMember = allMembers.length === 1;

  if (callerMember.role === 'owner' && !isLastMember) {
    const successor = findEarliestRemainingMember(allMembers, userId);

    if (successor) {
      await workspaceMemberRepository.updateRole(
        workspaceId,
        successor.userId,
        'owner',
        session
      );
    }
  }

  if (isLastMember) {
    await deleteWorkspaceCompletely(workspaceId, session);
  } else {
    await workspaceMemberRepository.deleteOne(workspaceId, userId, session);
  }

  await resetActiveWorkspaceIfMatches(userId, workspaceId, session);

  return { deleted: isLastMember };
};

export const removeMemberFromWorkspaceTx = async (
  workspaceId: Types.ObjectId,
  targetUserId: string,
  session: ClientSession
): Promise<void> => {
  await workspaceMemberRepository.deleteOne(workspaceId, targetUserId, session);
  await resetActiveWorkspaceIfMatches(targetUserId, workspaceId, session);
};
