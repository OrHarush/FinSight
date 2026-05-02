import { BalanceBreakdownResult } from '@lyra/shared';

import { formatBreakdownDate } from './formatBreakdownDate';
import { formatBreakdownMoney, formatSignedBreakdownMoney } from './formatBreakdownMoney';
import { translatePaymentMethod, translateTxType } from './translateBreakdown';

export const formatBreakdownClipboard = (result: BalanceBreakdownResult): string => {
  const headerLines = [
    `חשבון: ${result.accountName} (${result.accountId})`,
    `יתרת checkpoint: ${formatBreakdownMoney(result.checkpointBalance)}`,
    `תאריך checkpoint: ${formatBreakdownDate(result.checkpointDate)}`,
    `עכשיו: ${formatBreakdownDate(result.now)}`,
    `סה״כ נכלל: ${formatSignedBreakdownMoney(result.totalIncluded)}`,
    `דולגו (לפני checkpoint): ${result.totalSkippedPreCheckpoint}`,
    `דולגו (עתידיות): ${result.totalSkippedFuture}`,
    `יתרה סופית: ${formatBreakdownMoney(result.finalBalance)}`,
    '',
  ];

  const tableHeader = [
    'שם',
    'סוג',
    'תאריך',
    'סכום',
    'אמצעי תשלום',
    'תאריך אפקטיבי',
    'נכלל',
    'תרומה',
    'סיבה',
  ].join('\t');

  const rows = result.breakdown.map(entry =>
    [
      entry.name || '—',
      translateTxType(entry.type),
      formatBreakdownDate(entry.date),
      formatBreakdownMoney(entry.amount),
      translatePaymentMethod(entry.paymentMethodType),
      formatBreakdownDate(entry.effectiveBalanceDate),
      entry.included ? '✓' : '✗',
      formatSignedBreakdownMoney(entry.contributesToSum),
      entry.reason,
    ].join('\t')
  );

  return [...headerLines, tableHeader, ...rows].join('\n');
};
