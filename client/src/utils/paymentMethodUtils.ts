import { PaymentMethodType } from '@finsight/shared';

export const PAYMENT_TYPE_LOCALE_KEY: Record<PaymentMethodType, string> = {
  'Credit Card': 'creditCard',
  Debit: 'debit',
  'Bank Transfer': 'bankTransfer',
  Checks: 'checks',
  'Standing Order': 'standingOrder',
  PayPal: 'paypal',
  Bit: 'bit',
  PayBox: 'paybox',
  Cash: 'cash',
};

export interface PaymentTypeGroup {
  labelKey: string;
  types: PaymentMethodType[];
}

export const PAYMENT_TYPE_GROUPS: PaymentTypeGroup[] = [
  {
    labelKey: 'paymentMethods:typeGroups.banking',
    types: ['Bank Transfer', 'Debit', 'Checks', 'Standing Order'],
  },
  {
    labelKey: 'paymentMethods:typeGroups.credit',
    types: ['Credit Card'],
  },
  {
    labelKey: 'paymentMethods:typeGroups.digitalAndCash',
    types: ['Bit', 'PayBox', 'PayPal', 'Cash'],
  },
];
