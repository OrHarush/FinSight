import { Types } from 'mongoose';

import * as userRepository from '../repositories/userRepository';
import * as workspaceMemberRepository from '../repositories/workspaceMemberRepository';

export const ANONYMOUS_SENTINEL = '__anonymous__';

export const resolveCreatorName = async (
  creatorUserId: string | Types.ObjectId,
  workspaceId: string | Types.ObjectId
): Promise<string> => {
  const member = await workspaceMemberRepository.findOne(
    workspaceId,
    creatorUserId.toString()
  );

  if (!member) {
    return ANONYMOUS_SENTINEL;
  }

  const user = await userRepository.findById(creatorUserId.toString());

  return user?.name ?? ANONYMOUS_SENTINEL;
};

export const resolveCreatorNamesForWorkspace = async (
  creatorUserIds: (string | Types.ObjectId)[],
  workspaceId: string | Types.ObjectId
): Promise<Map<string, string>> => {
  const members = await workspaceMemberRepository.findByWorkspace(workspaceId);
  const currentMemberIds = new Set(members.map(m => m.userId.toString()));

  const result = new Map<string, string>();
  const stringIds = [...new Set(creatorUserIds.map(id => id.toString()))];

  await Promise.all(
    stringIds.map(async id => {
      if (!currentMemberIds.has(id)) {
        result.set(id, ANONYMOUS_SENTINEL);
        return;
      }

      const user = await userRepository.findById(id);
      result.set(id, user?.name ?? ANONYMOUS_SENTINEL);
    })
  );

  return result;
};
