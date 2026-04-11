import i18n, { TFunction } from 'i18next';

import { PaymentMethodType } from '@lyra/shared';

import { PaymentMethodDto } from '@/types/PaymentMethod';

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

export const getPaymentMethodDisplayName = (
  pm: Pick<PaymentMethodDto, 'name' | 'key' | 'type'> | null | undefined,
  t: TFunction<'paymentMethods'>
): string => {
  if (!pm) {
    return '';
  }

  if (pm.key) {
    const defaultName = i18n.getFixedT('en', 'paymentMethods')(`defaults.${pm.key}`);

    if (!pm.name || pm.name === defaultName) {
      return t(`defaults.${pm.key}`);
    }

    return pm.name;
  }

  if (pm.name) {
    return pm.name;
  }

  const localeKey = PAYMENT_TYPE_LOCALE_KEY[pm.type];

  return localeKey ? t(`types.${localeKey}`) : pm.type;
};

export const PAYMENT_TYPE_GROUPS: PaymentTypeGroup[] = [
  {
    labelKey: 'paymentMethods:typeGroups.cards',
    types: ['Credit Card', 'Debit'],
  },
  {
    labelKey: 'paymentMethods:typeGroups.banking',
    types: ['Bank Transfer', 'Checks', 'Standing Order'],
  },
  {
    labelKey: 'paymentMethods:typeGroups.digitalAndCash',
    types: ['Bit', 'PayBox', 'PayPal', 'Cash'],
  },
];
