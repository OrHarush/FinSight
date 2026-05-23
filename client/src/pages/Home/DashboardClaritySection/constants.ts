export const CLARITY_FIGURES = {
  balance: 6800,
  projected: 3600,
  income: 12000,
  expenses: 9150,
  breakdown: {
    futureIncome: 2000,
    futureExpenses: 5200,
    pendingPriorExpenses: 0,
  },
} as const;

export type AnnotationColor = 'purple' | 'grey';

export type AnnotationKey = 'projected' | 'balance' | 'why';

export interface ClarityCard {
  key: AnnotationKey;
  color?: AnnotationColor;
}

export const CLARITY_CARDS: ClarityCard[] = [
  { key: 'projected', color: 'purple' },
  { key: 'balance', color: 'grey' },
  { key: 'why' },
];
