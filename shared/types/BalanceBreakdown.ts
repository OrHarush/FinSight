export type BalanceBreakdownTransactionType = 'Income' | 'Expense' | 'Transfer';

export interface BalanceBreakdownEntry {
  _id: string;
  name: string;
  date: string;
  amount: number;
  type: BalanceBreakdownTransactionType;
  paymentMethodType: string | null;
  billingDay: number | null;
  effectiveBalanceDate: string;
  included: boolean;
  contributesToSum: number;
  reason: string;
}

export interface BalanceBreakdownResult {
  accountId: string;
  accountName: string;
  checkpointBalance: number;
  checkpointDate: string;
  now: string;
  totalIncluded: number;
  totalSkippedPreCheckpoint: number;
  totalSkippedFuture: number;
  finalBalance: number;
  breakdown: BalanceBreakdownEntry[];
}
