import mongoose, { Schema, Types } from 'mongoose';

export type ShortcutTokenStatus = 'pending' | 'approved' | 'used';

export interface IShortcutToken {
  _id: string;
  userId: Types.ObjectId;
  code: string;
  status: ShortcutTokenStatus;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ShortcutTokenSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'used'],
      required: true,
      default: 'pending',
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

ShortcutTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IShortcutToken>(
  'ShortcutToken',
  ShortcutTokenSchema,
  'shortcut_tokens'
);
