import { ClientSession, Types } from 'mongoose';

import Workspace, { IWorkspace } from '../models/Workspace';

export const insert = async (
  data: Omit<IWorkspace, '_id' | 'createdAt' | 'updatedAt'>,
  session?: ClientSession
) => {
  const workspace = new Workspace(data);
  return workspace.save({ session });
};

export const findById = async (id: string | Types.ObjectId) =>
  Workspace.findById(id).lean<IWorkspace>().exec();

export const findManyByIds = async (ids: Types.ObjectId[]) =>
  Workspace.find({ _id: { $in: ids } })
    .lean<IWorkspace[]>()
    .exec();

export const updateById = async (id: string, patch: Partial<IWorkspace>) =>
  Workspace.findByIdAndUpdate(id, patch, { new: true, runValidators: true })
    .lean<IWorkspace>()
    .exec();

export const deleteById = async (id: string | Types.ObjectId, session?: ClientSession) =>
  Workspace.deleteOne(
    { _id: new Types.ObjectId(id.toString()) },
    { session }
  );
