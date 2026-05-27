import mongoose, { Schema, Types } from 'mongoose';

export interface IWorkspaceMember {
  _id: string;
  workspaceId: Types.ObjectId;
  userId: Types.ObjectId;
  role: 'owner' | 'member';
  invitedBy?: Types.ObjectId;
  joinedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkspaceMemberSchema: Schema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'member'], required: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WorkspaceMemberSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });
WorkspaceMemberSchema.index({ userId: 1 });

export default mongoose.model<IWorkspaceMember>(
  'WorkspaceMember',
  WorkspaceMemberSchema,
  'workspace_members'
);
