import { useCallback, useState } from 'react';

import { TransactionDto } from '@/types/Transaction';

const DISMISSED_KEY = 'lyra_recurring_banner_dismissed';

export const useRecurringSetupBanner = (transactions: TransactionDto[], accountId: string) => {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === 'true');

  const accountTxs = transactions.filter(tx => tx.account?._id === accountId);
  const hasRecurringIncome = accountTxs.some(tx => tx.type === 'Income' && !!tx.frequency);
  const hasRecurringExpense = accountTxs.some(tx => tx.type === 'Expense' && !!tx.frequency);

  const shouldShow = (!hasRecurringIncome || !hasRecurringExpense) && !dismissed;

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setDismissed(true);
  }, []);

  return { shouldShow, dismiss };
};
