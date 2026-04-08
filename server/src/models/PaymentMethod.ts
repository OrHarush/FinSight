import { DefaultPaymentMethodKey, PAYMENT_METHOD_TYPES, PaymentMethodType } from '@lyra/shared';
import mongoose, { Schema, Types } from 'mongoose';

export interface IPaymentMethod {
  _id: string;
  name?: string;
  type: PaymentMethodType;
  billingDay: number | null;
  lastFourDigits?: string;
  isPrimary: boolean;
  key?: DefaultPaymentMethodKey;
  userId: Types.ObjectId;
}

const PaymentMethodSchema: Schema = new Schema(
  {
    name: { type: String, trim: true, maxlength: 30 },
    type: {
      type: String,
      enum: PAYMENT_METHOD_TYPES,
      required: true,
      default: 'Credit Card',
    },
    billingDay: {
      type: Number,
      min: 1,
      max: 31,
      default: null,
    },
    lastFourDigits: {
      type: String,
      minlength: 4,
      maxlength: 4,
    },
    isPrimary: {
      type: Boolean,
      default: false,
      required: true,
    },
    key: { type: String },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

PaymentMethodSchema.index({ name: 1, type: 1, userId: 1 }, { unique: true, sparse: true });

export default mongoose.model<IPaymentMethod>(
  'PaymentMethod',
  PaymentMethodSchema,
  'payment_methods'
);
