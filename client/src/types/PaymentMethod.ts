import type { PaymentMethodType } from '@finsight/shared';

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
