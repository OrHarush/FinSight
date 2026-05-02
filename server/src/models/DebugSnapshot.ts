import mongoose, { Schema, Types } from 'mongoose';

export interface IDebugSnapshotAccount {
  _id: Types.ObjectId;
  balance: number;
  checkpointBalance: number;
  checkpointDate?: Date | null;
}

export interface IDebugSnapshotTemplate {
  _id: Types.ObjectId;
  lastGeneratedDate?: Date | null;
}

export interface IDebugSnapshot {
  _id: string;
  userId: Types.ObjectId;
  takenAt: Date;
  restoredAt: Date | null;
  reason: string;
  accounts: IDebugSnapshotAccount[];
  templates: IDebugSnapshotTemplate[];
  createdTxIds: Types.ObjectId[];
}

const DebugSnapshotAccountSchema = new Schema<IDebugSnapshotAccount>(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    balance: { type: Number, required: true },
    checkpointBalance: { type: Number, required: true },
    checkpointDate: { type: Date, default: null },
  },
  { _id: false }
);

const DebugSnapshotTemplateSchema = new Schema<IDebugSnapshotTemplate>(
  {
    _id: { type: Schema.Types.ObjectId, required: true },
    lastGeneratedDate: { type: Date, default: null },
  },
  { _id: false }
);

const DebugSnapshotSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    takenAt: { type: Date, required: true, default: () => new Date() },
    restoredAt: { type: Date, default: null },
    reason: { type: String, required: true, default: 'debug-run-for-me' },
    accounts: { type: [DebugSnapshotAccountSchema], default: [] },
    templates: { type: [DebugSnapshotTemplateSchema], default: [] },
    createdTxIds: { type: [Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

DebugSnapshotSchema.index({ userId: 1, takenAt: -1 });

export default mongoose.model<IDebugSnapshot>(
  'DebugSnapshot',
  DebugSnapshotSchema,
  'debugSnapshots'
);
