import mongoose, { Schema } from 'mongoose';

export interface IWorkspace {
  _id: string;
  name: string;
  type: 'personal' | 'shared';
  currency: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkspaceSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    type: { type: String, enum: ['personal', 'shared'], required: true },
    currency: { type: String, default: 'ILS' },
  },
  { timestamps: true }
);

export default mongoose.model<IWorkspace>('Workspace', WorkspaceSchema, 'workspaces');
