import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPaymentMethod extends Document {
  name: string;
  type: 'Credit' | 'Debit' | 'BankTransfer' | 'PayPal' | 'Other';
  billingDay: number | null;
  last4?: string;
  isPrimary: boolean;
  userId: Types.ObjectId;
}

const PaymentMethodSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['Credit', 'Debit', 'BankTransfer', 'PayPal', 'Other'],
      required: true,
      default: 'Credit',
    },
    billingDay: {
      type: Number,
      min: 1,
      max: 31,
      default: null,
    },
    last4: {
      type: String,
      minlength: 4,
      maxlength: 4,
    },
    isPrimary: {
      type: Boolean,
      default: false,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

PaymentMethodSchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model<IPaymentMethod>(
  'PaymentMethod',
  PaymentMethodSchema,
  'payment_methods'
);
