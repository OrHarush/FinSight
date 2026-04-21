export const QUICK_CHIP_SEED_KEYS = [
  'coffee',
  'groceries',
  'fuel',
  'bit_transfer',
  'pharmacy',
] as const;

export type QuickChipSeedKey = (typeof QUICK_CHIP_SEED_KEYS)[number];

export interface QuickChipSeedDefinition {
  key: QuickChipSeedKey;
  amount: number;
  categoryKey: string;
  paymentMethodKey: string;
}

export const QUICK_CHIP_SEEDS: readonly QuickChipSeedDefinition[] = [
  { key: 'coffee', amount: 14, categoryKey: 'dining_out', paymentMethodKey: 'credit_card' },
  { key: 'groceries', amount: 180, categoryKey: 'groceries', paymentMethodKey: 'credit_card' },
  { key: 'fuel', amount: 250, categoryKey: 'transportation', paymentMethodKey: 'credit_card' },
  { key: 'bit_transfer', amount: 100, categoryKey: 'dining_out', paymentMethodKey: 'bank_transfer' },
  { key: 'pharmacy', amount: 60, categoryKey: 'health', paymentMethodKey: 'credit_card' },
];

export interface QuickChipDto {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  paymentMethodId: string;
  isSeed: boolean;
  seedKey?: QuickChipSeedKey;
}
