import mongoose, { Schema } from 'mongoose';

const DEFAULT_WORKSPACE_ICON = 'Person';
const DEFAULT_WORKSPACE_COLOR = '#534AB7';

export interface IWorkspace {
  _id: string;
  name: string;
  type: 'personal' | 'shared';
  currency: string;
  icon: string;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkspaceSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    type: { type: String, enum: ['personal', 'shared'], required: true },
    currency: { type: String, default: 'ILS' },
    icon: { type: String, required: true, default: DEFAULT_WORKSPACE_ICON },
    color: { type: String, required: true, default: DEFAULT_WORKSPACE_COLOR },
  },
  { timestamps: true }
);

export default mongoose.model<IWorkspace>('Workspace', WorkspaceSchema, 'workspaces');
