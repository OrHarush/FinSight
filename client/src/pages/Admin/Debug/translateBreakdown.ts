import { BalanceBreakdownTransactionType } from '@lyra/shared';

const TX_TYPE_HE: Record<BalanceBreakdownTransactionType, string> = {
  Income: 'הכנסה',
  Expense: 'הוצאה',
  Transfer: 'העברה',
};

const PAYMENT_METHOD_HE: Record<string, string> = {
  'Credit Card': 'כרטיס אשראי',
  Debit: 'דביט',
  'Bank Transfer': 'העברה בנקאית',
  Checks: 'ציקים',
  'Standing Order': 'הוראת קבע',
  PayPal: 'פייפאל',
  Bit: 'ביט',
  PayBox: 'פייבוקס',
  Cash: 'מזומן',
};

export const translateTxType = (type: BalanceBreakdownTransactionType): string =>
  TX_TYPE_HE[type] ?? type;

export const translatePaymentMethod = (type: string | null): string => {
  if (!type) {
    return '—';
  }

  return PAYMENT_METHOD_HE[type] ?? type;
};
