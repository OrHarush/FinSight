import mongoose, { Schema, Types } from 'mongoose';

export type ShortcutPairingCodeStatus = 'pending' | 'approved' | 'used';

export interface IShortcutPairingCode {
  _id: string;
  userId: Types.ObjectId;
  code: string;
  status: ShortcutPairingCodeStatus;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const ShortcutPairingCodeSchema: Schema = new Schema(
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

ShortcutPairingCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IShortcutPairingCode>(
  'ShortcutPairingCode',
  ShortcutPairingCodeSchema,
  'shortcut_pairing_codes'
);
