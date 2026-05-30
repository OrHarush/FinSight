import { ClientSession, Types } from 'mongoose';

import WorkspaceInvitation, {
  IWorkspaceInvitation,
  WorkspaceInvitationStatus,
} from '../models/WorkspaceInvitation';

export const insert = async (
  data: Omit<IWorkspaceInvitation, '_id' | 'createdAt' | 'updatedAt'>
) => {
  const invitation = new WorkspaceInvitation(data);
  return invitation.save();
};

export const findByToken = async (token: string) =>
  WorkspaceInvitation.findOne({ token }).lean<IWorkspaceInvitation>().exec();

export const findById = async (id: string) =>
  WorkspaceInvitation.findById(id).lean<IWorkspaceInvitation>().exec();

export const findPendingForWorkspace = async (workspaceId: string | Types.ObjectId) =>
  WorkspaceInvitation.find({
    workspaceId: new Types.ObjectId(workspaceId.toString()),
    status: 'pending',
  })
    .lean<IWorkspaceInvitation[]>()
    .exec();

export const findPendingByEmail = async (
  workspaceId: string | Types.ObjectId,
  invitedEmail: string
) =>
  WorkspaceInvitation.findOne({
    workspaceId: new Types.ObjectId(workspaceId.toString()),
    invitedEmail,
    status: 'pending',
  })
    .lean<IWorkspaceInvitation>()
    .exec();

export const countPendingForWorkspace = async (
  workspaceId: string | Types.ObjectId
): Promise<number> =>
  WorkspaceInvitation.countDocuments({
    workspaceId: new Types.ObjectId(workspaceId.toString()),
    status: 'pending',
  });

interface StatusPatch {
  status: WorkspaceInvitationStatus;
  acceptedByUserId?: Types.ObjectId;
}

export const updateStatusById = async (id: string, patch: StatusPatch) =>
  WorkspaceInvitation.findByIdAndUpdate(id, patch, { new: true }).lean<IWorkspaceInvitation>().exec();

export const deleteMany = (filter: object, session?: ClientSession) =>
  WorkspaceInvitation.deleteMany(filter, { session });
