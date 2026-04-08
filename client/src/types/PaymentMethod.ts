import type { DefaultPaymentMethodKey, PaymentMethodType } from '@lyra/shared';

export interface PaymentMethodDto {
  _id: string;
  name?: string;
  type: PaymentMethodType;
  billingDay?: number;
  lastFourDigits?: string;
  isPrimary: boolean;
  key?: DefaultPaymentMethodKey;
  createdAt: string;
  updatedAt: string;
}
