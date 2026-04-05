import type { PaymentMethodType } from '@lyra/shared';

export interface PaymentMethodDto {
  _id: string;
  name: string;
  type: PaymentMethodType;
  billingDay?: number;
  lastFourDigits?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
