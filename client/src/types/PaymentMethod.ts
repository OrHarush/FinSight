export interface PaymentMethodFormValues {
  name: string;
  type: 'Credit' | 'Debit' | 'BankTransfer' | 'PayPal' | 'Other';
  billingDay: number | null;
  last4?: string;
  isPrimary: boolean;
}

export interface PaymentMethodDto {
  _id: string;
  name: string;
  type: 'Credit' | 'Debit' | 'BankTransfer' | 'PayPal' | 'Other';
  billingDay: number | null;
  last4?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
