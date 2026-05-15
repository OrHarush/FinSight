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

const LEGACY_DEFAULT_NAMES: Record<string, readonly string[]> = {
  immediate_debit: ['Immediate Debit'],
};

const isDefaultName = (key: string, name: string, currentDefaultName: string): boolean => {
  if (name === currentDefaultName) {
    return true;
  }

  return LEGACY_DEFAULT_NAMES[key]?.includes(name) ?? false;
};

export const getPaymentMethodDisplayName = (
  pm: Pick<PaymentMethodDto, 'name' | 'key' | 'type'> | null | undefined,
  t: TFunction<'paymentMethods'>
): string => {
  if (!pm) {
    return '';
  }

  if (pm.key) {
    const defaultName = i18n.getFixedT('en', 'paymentMethods')(`defaults.${pm.key}`);

    if (!pm.name || isDefaultName(pm.key, pm.name, defaultName)) {
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
