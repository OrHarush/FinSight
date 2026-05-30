import { ClientSession, Types } from 'mongoose';

import WorkspaceMember, { IWorkspaceMember } from '../models/WorkspaceMember';

export const insert = async (
  data: Omit<IWorkspaceMember, '_id' | 'createdAt' | 'updatedAt'>,
  session?: ClientSession
) => {
  const member = new WorkspaceMember(data);
  return member.save({ session });
};

export const findByUser = async (userId: string) =>
  WorkspaceMember.find({ userId: new Types.ObjectId(userId) })
    .lean<IWorkspaceMember[]>()
    .exec();

export const findByWorkspace = async (workspaceId: string | Types.ObjectId) =>
  WorkspaceMember.find({ workspaceId: new Types.ObjectId(workspaceId.toString()) })
    .lean<IWorkspaceMember[]>()
    .exec();

export const findOne = async (workspaceId: string | Types.ObjectId, userId: string) =>
  WorkspaceMember.findOne({
    workspaceId: new Types.ObjectId(workspaceId.toString()),
    userId: new Types.ObjectId(userId),
  })
    .lean<IWorkspaceMember>()
    .exec();

export const countByWorkspace = async (workspaceId: string | Types.ObjectId): Promise<number> =>
  WorkspaceMember.countDocuments({
    workspaceId: new Types.ObjectId(workspaceId.toString()),
  });

export const countByUser = async (userId: string): Promise<number> =>
  WorkspaceMember.countDocuments({ userId: new Types.ObjectId(userId) });

export const deleteOne = async (
  workspaceId: string | Types.ObjectId,
  userId: string,
  session?: ClientSession
) =>
  WorkspaceMember.deleteOne(
    {
      workspaceId: new Types.ObjectId(workspaceId.toString()),
      userId: new Types.ObjectId(userId),
    },
    { session }
  );

export const deleteMany = (filter: object, session?: ClientSession) =>
  WorkspaceMember.deleteMany(filter, { session });

export const updateRole = async (
  workspaceId: string | Types.ObjectId,
  userId: string | Types.ObjectId,
  role: IWorkspaceMember['role'],
  session?: ClientSession
) =>
  WorkspaceMember.updateOne(
    {
      workspaceId: new Types.ObjectId(workspaceId.toString()),
      userId: new Types.ObjectId(userId.toString()),
    },
    { $set: { role } },
    { session }
  );
