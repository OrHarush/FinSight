import { ClientSession, Types } from 'mongoose';

import DebugSnapshot, {
  IDebugSnapshot,
  IDebugSnapshotAccount,
  IDebugSnapshotTemplate,
} from '../models/DebugSnapshot';

interface InsertInput {
  userId: string;
  reason?: string;
  accounts: IDebugSnapshotAccount[];
  templates: IDebugSnapshotTemplate[];
}

export const insert = async ({
  userId,
  reason = 'debug-run-for-me',
  accounts,
  templates,
}: InsertInput) => {
  const snapshot = new DebugSnapshot({
    userId: new Types.ObjectId(userId),
    takenAt: new Date(),
    restoredAt: null,
    reason,
    accounts,
    templates,
    createdTxIds: [],
  });

  return snapshot.save();
};

export const findLatestActiveByUser = async (userId: string) =>
  DebugSnapshot.findOne({ userId: new Types.ObjectId(userId), restoredAt: null })
    .sort({ takenAt: -1 })
    .lean<IDebugSnapshot>()
    .exec();

export const findById = async (id: string, userId: string) =>
  DebugSnapshot.findOne({ _id: id, userId: new Types.ObjectId(userId) })
    .lean<IDebugSnapshot>()
    .exec();

export const findManyByUser = async (userId: string, limit = 20) =>
  DebugSnapshot.find({ userId: new Types.ObjectId(userId) })
    .sort({ takenAt: -1 })
    .limit(limit)
    .lean<IDebugSnapshot[]>()
    .exec();

export const markRestored = async (id: string) =>
  DebugSnapshot.updateOne({ _id: id }, { $set: { restoredAt: new Date() } }).exec();

export const appendCreatedTxIds = async (id: string, ids: Types.ObjectId[]) =>
  DebugSnapshot.updateOne({ _id: id }, { $push: { createdTxIds: { $each: ids } } }).exec();

export const deleteMany = (filter: object, session?: ClientSession) =>
  DebugSnapshot.deleteMany(filter).session(session ?? null);
