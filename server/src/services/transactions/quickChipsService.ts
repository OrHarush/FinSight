import {
  fromCents,
  QUICK_CHIP_SEEDS,
  QuickChipDto,
  QuickChipSeedDefinition,
} from '@lyra/shared';
import { Types } from 'mongoose';

import Category, { ICategory } from '../../models/Category';
import PaymentMethod, { IPaymentMethod } from '../../models/PaymentMethod';
import * as transactionRepository from '../../repositories/transactionRepository';

const CHIP_LIMIT = 5;
const LOOKBACK_DAYS = 60;
const MIN_OCCURRENCES_FOR_REAL = 3;
const REAL_FETCH_LIMIT = 20;
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  chips: QuickChipDto[];
  expiresAt: number;
}

const cacheByWorkspace = new Map<string, CacheEntry>();

const resolveSeedCategory = (
  seed: QuickChipSeedDefinition,
  categories: ICategory[]
): ICategory | undefined => {
  const expenseCategories = categories.filter(c => c.type === 'Expense');
  const byKey = expenseCategories.find(c => c.key === seed.categoryKey);

  if (byKey) {
    return byKey;
  }

  return expenseCategories[0];
};

const resolveSeedPaymentMethod = (
  seed: QuickChipSeedDefinition,
  paymentMethods: IPaymentMethod[]
): IPaymentMethod | undefined => {
  const byKey = paymentMethods.find(pm => pm.key === seed.paymentMethodKey);

  if (byKey) {
    return byKey;
  }

  return paymentMethods.find(pm => pm.isPrimary) ?? paymentMethods[0];
};

const buildSeedChips = (
  categories: ICategory[],
  paymentMethods: IPaymentMethod[],
  taken: Set<string>
): QuickChipDto[] => {
  const chips: QuickChipDto[] = [];

  for (const seed of QUICK_CHIP_SEEDS) {
    const category = resolveSeedCategory(seed, categories);
    const paymentMethod = resolveSeedPaymentMethod(seed, paymentMethods);

    if (!category || !paymentMethod) {
      continue;
    }

    const dedupeKey = makeDedupeKey(
      seed.key,
      category._id.toString(),
      paymentMethod._id.toString()
    );

    if (taken.has(dedupeKey)) {
      continue;
    }

    taken.add(dedupeKey);

    chips.push({
      id: `seed-${seed.key}`,
      name: seed.key,
      amount: seed.amount,
      categoryId: category._id.toString(),
      paymentMethodId: paymentMethod._id.toString(),
      isSeed: true,
      seedKey: seed.key,
    });
  }

  return chips;
};

const makeDedupeKey = (name: string, categoryId: string, paymentMethodId: string) =>
  `${name.toLowerCase()}::${categoryId}::${paymentMethodId}`;

const fetchFrequentChips = async (workspaceId: string): Promise<QuickChipDto[]> => {
  const now = new Date();
  const since = new Date(now.getTime() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  const aggregations = await transactionRepository.aggregateFrequentExpensePatterns(
    workspaceId,
    since,
    now,
    MIN_OCCURRENCES_FOR_REAL,
    REAL_FETCH_LIMIT
  );

  return aggregations.slice(0, CHIP_LIMIT).map(entry => ({
    id: `real-${entry.name}-${entry.categoryId.toString()}-${entry.paymentMethodId.toString()}`,
    name: entry.name,
    amount: fromCents(entry.latestAmount),
    categoryId: entry.categoryId.toString(),
    paymentMethodId: entry.paymentMethodId.toString(),
    isSeed: false,
  }));
};

const buildChipsForWorkspace = async (workspaceId: string): Promise<QuickChipDto[]> => {
  const workspaceObjectId = new Types.ObjectId(workspaceId);

  const [realChips, categories, paymentMethods] = await Promise.all([
    fetchFrequentChips(workspaceId),
    Category.find({ workspaceId: workspaceObjectId }).lean<ICategory[]>(),
    PaymentMethod.find({ workspaceId: workspaceObjectId }).lean<IPaymentMethod[]>(),
  ]);

  const taken = new Set<string>();

  for (const chip of realChips) {
    taken.add(makeDedupeKey(chip.name, chip.categoryId, chip.paymentMethodId));
  }

  const remainingSlots = CHIP_LIMIT - realChips.length;

  if (remainingSlots <= 0) {
    return realChips;
  }

  const seedChips = buildSeedChips(categories, paymentMethods, taken).slice(0, remainingSlots);

  return [...realChips, ...seedChips];
};

export const getQuickChips = async (workspaceId: string): Promise<QuickChipDto[]> => {
  const cached = cacheByWorkspace.get(workspaceId);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.chips;
  }

  const chips = await buildChipsForWorkspace(workspaceId);

  cacheByWorkspace.set(workspaceId, { chips, expiresAt: Date.now() + CACHE_TTL_MS });

  return chips;
};

export const invalidateQuickChipsCache = (workspaceId: string) => {
  cacheByWorkspace.delete(workspaceId);
};
