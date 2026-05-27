import mongoose, { Schema, Types } from 'mongoose';

export type WorkspaceInvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export interface IWorkspaceInvitation {
  _id: string;
  workspaceId: Types.ObjectId;
  invitedEmail: string;
  invitedBy: Types.ObjectId;
  token: string;
  status: WorkspaceInvitationStatus;
  expiresAt: Date;
  acceptedByUserId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkspaceInvitationSchema: Schema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    invitedEmail: { type: String, required: true, lowercase: true, trim: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired', 'revoked'],
      required: true,
      default: 'pending',
    },
    expiresAt: { type: Date, required: true },
    acceptedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

WorkspaceInvitationSchema.index({ invitedEmail: 1, status: 1 });

export default mongoose.model<IWorkspaceInvitation>(
  'WorkspaceInvitation',
  WorkspaceInvitationSchema,
  'workspace_invitations'
);
