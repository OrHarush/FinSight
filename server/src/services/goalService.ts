import {
  CreateGoalDTO,
  fromCents,
  GetGoalsQuery,
  toCents,
  UpdateGoalDTO,
} from '@lyra/shared';
import mongoose, { Types } from 'mongoose';

import { ApiError } from '../errors/ApiError';
import { ICategory } from '../models/Category';
import { IGoal } from '../models/Goal';
import Transaction from '../models/Transaction';
import * as categoryRepository from '../repositories/categoryRepository';
import * as goalRepository from '../repositories/goalRepository';
import {
  buildProjectionPoints,
  projectFinalValue,
  ProjectionPoint,
  requiredMonthlyContribution,
} from '../utils/goalProjection';
import * as analyticsService from './analyticsService';

const DEFAULT_SAVINGS_COLOR = '#9ca3af';
const PACE_LOOKBACK_MONTHS = 3;

const startOfTodayUtc = () => {
  const now = new Date();

  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

const monthsBetween = (from: Date, to: Date) => {
  const years = to.getUTCFullYear() - from.getUTCFullYear();
  const months = to.getUTCMonth() - from.getUTCMonth();

  return Math.max(years * 12 + months, 0);
};

const formatYearMonthUtc = (d: Date) => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');

  return `${y}-${m}`;
};

const isReplicaSetTransactionError = (err: unknown) => {
  if (!err || typeof err !== 'object') return false;

  const message = (err as { message?: string }).message ?? '';

  return message.includes('Transaction numbers') || message.includes('replica set');
};

const assertValidObjectId = (id: string, label: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(`Invalid ${label} ID`);
  }
};

const presentGoal = (goal: IGoal, category?: ICategory | null) => ({
  ...goal,
  targetAmount: fromCents(goal.targetAmount),
  initialAmount: fromCents(goal.initialAmount ?? 0),
  category: category ?? null,
});

const buildSavingsCategory = (
  dto: CreateGoalDTO,
  userId: string,
  workspaceId: Types.ObjectId
): Omit<ICategory, '_id'> => ({
  name: dto.name,
  type: 'Savings',
  color: dto.color ?? DEFAULT_SAVINGS_COLOR,
  icon: dto.icon ?? '',
  userId: new Types.ObjectId(userId),
  workspaceId,
});

const buildGoalDocument = (
  dto: CreateGoalDTO,
  userId: string,
  categoryId: Types.ObjectId,
  workspaceId: Types.ObjectId
): Omit<IGoal, '_id' | 'createdAt' | 'updatedAt'> => ({
  userId: new Types.ObjectId(userId),
  workspaceId,
  name: dto.name,
  icon: dto.icon ?? null,
  color: dto.color ?? null,
  targetAmount: toCents(dto.targetAmount),
  initialAmount: toCents(dto.initialAmount ?? 0),
  targetDate: dto.targetDate,
  expectedAnnualReturn: dto.expectedAnnualReturn ?? 0,
  importance: dto.importance ?? 'medium',
  description: dto.description ?? null,
  categoryId,
  status: 'active',
});

const buildGoalPatch = (patch: UpdateGoalDTO): Partial<IGoal> => {
  const result: Partial<IGoal> = {};

  if (patch.name !== undefined) result.name = patch.name;
  if (patch.icon !== undefined) result.icon = patch.icon ?? null;
  if (patch.color !== undefined) result.color = patch.color ?? null;
  if (patch.targetAmount !== undefined) result.targetAmount = toCents(patch.targetAmount);
  if (patch.initialAmount !== undefined) result.initialAmount = toCents(patch.initialAmount);
  if (patch.targetDate !== undefined) result.targetDate = patch.targetDate;
  if (patch.expectedAnnualReturn !== undefined) result.expectedAnnualReturn = patch.expectedAnnualReturn;
  if (patch.importance !== undefined) result.importance = patch.importance;
  if (patch.description !== undefined) result.description = patch.description ?? null;
  if (patch.status !== undefined) result.status = patch.status;

  return result;
};

const buildLinkedCategoryPatch = (patch: UpdateGoalDTO, existing: IGoal): Partial<ICategory> => {
  const result: Partial<ICategory> = {};

  if (patch.name !== undefined && patch.name !== existing.name) result.name = patch.name;
  if (patch.icon !== undefined) result.icon = patch.icon ?? '';
  if (patch.color !== undefined) result.color = patch.color ?? DEFAULT_SAVINGS_COLOR;

  return result;
};

export const findAll = async (userId: string, workspaceId: string, query: GetGoalsQuery) => {
  const goals = await goalRepository.findMany(workspaceId, { status: query.status });

  return Promise.all(
    goals.map(async (goal) => {
      const [category, currentValueCents] = await Promise.all([
        categoryRepository.findById(goal.categoryId.toString(), workspaceId),
        // contributions come from transactions, which are still userId-scoped
        computeCurrentValueCents(userId, goal),
      ]);

      return {
        ...presentGoal(goal, category as ICategory | null),
        currentValue: fromCents(currentValueCents),
      };
    })
  );
};

export const getGoalById = async (id: string, workspaceId: string) => {
  assertValidObjectId(id, 'goal');

  const goal = await goalRepository.findById(id, workspaceId);

  if (!goal) {
    throw ApiError.notFound('Goal not found');
  }

  const category = await categoryRepository.findById(goal.categoryId.toString(), workspaceId);

  return presentGoal(goal, category as ICategory | null);
};

const insertGoalAtomically = async (
  dto: CreateGoalDTO,
  userId: string,
  workspaceId: Types.ObjectId
) => {
  const session = await mongoose.startSession();

  try {
    let createdGoal: IGoal | null = null;
    let createdCategory: ICategory | null = null;

    await session.withTransaction(async () => {
      const category = await categoryRepository.insert(
        buildSavingsCategory(dto, userId, workspaceId),
        session
      );
      createdCategory = category.toObject() as ICategory;

      const goal = await goalRepository.insert(
        buildGoalDocument(dto, userId, category._id as unknown as Types.ObjectId, workspaceId),
        session
      );
      createdGoal = goal.toObject() as IGoal;
    });

    return presentGoal(createdGoal!, createdCategory);
  } finally {
    await session.endSession();
  }
};

const insertGoalWithCompensation = async (
  dto: CreateGoalDTO,
  userId: string,
  workspaceId: Types.ObjectId
) => {
  const category = await categoryRepository.insert(buildSavingsCategory(dto, userId, workspaceId));
  const categoryDoc = category.toObject() as ICategory;

  try {
    const goal = await goalRepository.insert(
      buildGoalDocument(dto, userId, category._id as unknown as Types.ObjectId, workspaceId)
    );

    return presentGoal(goal.toObject() as IGoal, categoryDoc);
  } catch (err) {
    try {
      await categoryRepository.remove(category._id.toString(), workspaceId.toString());
    } catch (cleanupErr) {
      console.error('[goalService] failed to roll back orphan category', {
        categoryId: category._id.toString(),
        userId,
        cleanupErr,
      });
    }

    throw err;
  }
};

export const createGoal = async (userId: string, workspaceId: string, dto: CreateGoalDTO) => {
  const existingByName = await goalRepository.findByNameCaseInsensitive(workspaceId, dto.name);

  if (existingByName) {
    throw ApiError.badRequest('GOAL_NAME_TAKEN');
  }

  const workspaceObjId = new Types.ObjectId(workspaceId);

  const result = await (async () => {
    try {
      return await insertGoalAtomically(dto, userId, workspaceObjId);
    } catch (err) {
      if (!isReplicaSetTransactionError(err)) {
        throw err;
      }

      return insertGoalWithCompensation(dto, userId, workspaceObjId);
    }
  })();

  void analyticsService
    .track(userId, 'goal_created')
    .catch(err => console.error('Failed to track goal_created:', err));

  return result;
};

const assertNameAvailable = async (workspaceId: string, name: string, currentId: string) => {
  const dup = await goalRepository.findByNameCaseInsensitive(workspaceId, name);

  if (dup && dup._id.toString() !== currentId) {
    throw ApiError.badRequest('GOAL_NAME_TAKEN');
  }
};

const assertTargetDateNotInPast = (patch: UpdateGoalDTO, existing: IGoal) => {
  const willBeActive = (patch.status ?? existing.status) === 'active';

  if (patch.targetDate && willBeActive && patch.targetDate < startOfTodayUtc()) {
    throw ApiError.badRequest('TARGET_DATE_IN_PAST');
  }
};

export const updateGoal = async (workspaceId: string, id: string, patch: UpdateGoalDTO) => {
  assertValidObjectId(id, 'goal');

  const existing = await goalRepository.findById(id, workspaceId);

  if (!existing) {
    throw ApiError.notFound('Goal not found');
  }

  assertTargetDateNotInPast(patch, existing);

  if (patch.name && patch.name !== existing.name) {
    await assertNameAvailable(workspaceId, patch.name, id);
  }

  const updatedGoal = await goalRepository.updateById(id, buildGoalPatch(patch), workspaceId);

  if (!updatedGoal) {
    throw ApiError.internal('Unexpected error updating goal');
  }

  const categoryPatch = buildLinkedCategoryPatch(patch, existing);

  if (Object.keys(categoryPatch).length > 0) {
    await categoryRepository.updateById(existing.categoryId.toString(), categoryPatch, workspaceId);
  }

  const category = await categoryRepository.findById(existing.categoryId.toString(), workspaceId);

  return presentGoal(updatedGoal, category as ICategory | null);
};

// transactions are still userId-scoped (flipped in their own task)
const countTransactionsForCategory = async (userId: string, categoryId: Types.ObjectId) =>
  Transaction.countDocuments({
    userId: new Types.ObjectId(userId),
    category: categoryId,
  });

const flipCategoryBackToExpense = (goal: IGoal, workspaceId: string) =>
  categoryRepository.updateById(goal.categoryId.toString(), { type: 'Expense' }, workspaceId);

export const deleteGoal = async (
  userId: string,
  workspaceId: string,
  id: string,
  keepCategory: boolean
) => {
  assertValidObjectId(id, 'goal');

  const goal = await goalRepository.findById(id, workspaceId);

  if (!goal) {
    throw ApiError.notFound('Goal not found');
  }

  if (keepCategory) {
    await flipCategoryBackToExpense(goal, workspaceId);
    await goalRepository.remove(id, workspaceId);

    return { id, keptCategory: true };
  }

  const txCount = await countTransactionsForCategory(userId, goal.categoryId);

  if (txCount > 0) {
    throw ApiError.badRequest('CATEGORY_HAS_TRANSACTIONS');
  }

  await goalRepository.remove(id, workspaceId);
  await categoryRepository.remove(goal.categoryId.toString(), workspaceId);

  return { id, keptCategory: false };
};

interface AggregateRow {
  _id: 'Income' | 'Expense' | 'Transfer';
  total: number;
}

interface MonthRow {
  _id: { yearMonth: string; type: 'Income' | 'Expense' | 'Transfer' };
  total: number;
}

const sumNetContributionCents = (rows: AggregateRow[]) => {
  const expenseSum = rows.find((r) => r._id === 'Expense')?.total ?? 0;
  const incomeSum = rows.find((r) => r._id === 'Income')?.total ?? 0;

  return expenseSum - incomeSum;
};

const aggregateContributionsCents = async (userId: string, categoryId: Types.ObjectId) => {
  const rows = await Transaction.aggregate<AggregateRow>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        category: categoryId,
      },
    },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);

  return sumNetContributionCents(rows);
};

const computeCurrentValueCents = async (userId: string, goal: IGoal) => {
  const contributions = await aggregateContributionsCents(userId, goal.categoryId);

  return (goal.initialAmount ?? 0) + contributions;
};

const aggregateContributionsByMonth = async (userId: string, categoryId: Types.ObjectId) => {
  const rows = await Transaction.aggregate<MonthRow>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        category: categoryId,
        date: { $exists: true, $ne: null },
      },
    },
    {
      $group: {
        _id: {
          yearMonth: { $dateToString: { format: '%Y-%m', date: '$date' } },
          type: '$type',
        },
        total: { $sum: '$amount' },
      },
    },
  ]);

  const byMonth = new Map<string, number>();

  for (const row of rows) {
    const sign = row._id.type === 'Income' ? -1 : row._id.type === 'Expense' ? 1 : 0;

    if (sign === 0) continue;

    const current = byMonth.get(row._id.yearMonth) ?? 0;
    byMonth.set(row._id.yearMonth, current + sign * row.total);
  }

  return Array.from(byMonth.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, amount]) => ({ month, amount }));
};

const computeActualPaceCents = (
  contributionsByMonth: Array<{ month: string; amount: number }>,
  todayUtc: Date
): number => {
  if (contributionsByMonth.length === 0) return 0;

  const cutoff = new Date(
    Date.UTC(todayUtc.getUTCFullYear(), todayUtc.getUTCMonth() - PACE_LOOKBACK_MONTHS, 1)
  );
  const cutoffYm = formatYearMonthUtc(cutoff);
  const currentYm = formatYearMonthUtc(todayUtc);
  const recent = contributionsByMonth.filter((c) => c.month >= cutoffYm && c.month < currentYm);

  if (recent.length === 0) return 0;

  const sum = recent.reduce((acc, c) => acc + c.amount, 0);

  return sum / recent.length;
};

interface GoalProjection {
  goal: ReturnType<typeof presentGoal>;
  currentValue: number;
  monthsRemaining: number;
  requiredMonthlyContribution: number;
  projectedFinalValue: number;
  onTrack: boolean;
  shortfall: number;
  contributionsByMonth: Array<{ month: string; amount: number }>;
  projectionPoints: ProjectionPoint[];
}

export const getGoalProjection = async (
  userId: string,
  workspaceId: string,
  id: string
): Promise<GoalProjection> => {
  assertValidObjectId(id, 'goal');

  const goal = await goalRepository.findById(id, workspaceId);

  if (!goal) {
    throw ApiError.notFound('Goal not found');
  }

  const category = await categoryRepository.findById(goal.categoryId.toString(), workspaceId);
  const today = startOfTodayUtc();

  const [currentValueCents, contributionsByMonthCents] = await Promise.all([
    computeCurrentValueCents(userId, goal),
    aggregateContributionsByMonth(userId, goal.categoryId),
  ]);

  const monthsRemaining = monthsBetween(today, goal.targetDate);

  const requiredCents = requiredMonthlyContribution(
    currentValueCents,
    goal.targetAmount,
    monthsRemaining,
    goal.expectedAnnualReturn
  );

  const actualPaceCents = computeActualPaceCents(contributionsByMonthCents, today);
  const paceCents = actualPaceCents > 0 ? actualPaceCents : requiredCents;

  const projectedFinalCents = projectFinalValue(
    currentValueCents,
    paceCents,
    monthsRemaining,
    goal.expectedAnnualReturn
  );

  const shortfallCents = Math.max(goal.targetAmount - projectedFinalCents, 0);
  const onTrack = projectedFinalCents >= goal.targetAmount;

  const projectionPointsCents = buildProjectionPoints(
    currentValueCents,
    paceCents,
    monthsRemaining,
    goal.expectedAnnualReturn,
    contributionsByMonthCents,
    today
  );

  return {
    goal: presentGoal(goal, category as ICategory | null),
    currentValue: fromCents(currentValueCents),
    monthsRemaining,
    requiredMonthlyContribution: fromCents(requiredCents),
    projectedFinalValue: fromCents(projectedFinalCents),
    onTrack,
    shortfall: fromCents(shortfallCents),
    contributionsByMonth: contributionsByMonthCents.map((c) => ({
      month: c.month,
      amount: fromCents(c.amount),
    })),
    projectionPoints: projectionPointsCents.map((p) => ({ ...p, value: fromCents(p.value) })),
  };
};

const aggregateMonthContributionCents = async (
  userId: string,
  categoryId: Types.ObjectId,
  yearMonth: string
) => {
  const [yearStr, monthStr] = yearMonth.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 1));

  const rows = await Transaction.aggregate<AggregateRow>([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        category: categoryId,
        date: { $gte: start, $lt: end },
      },
    },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);

  return sumNetContributionCents(rows);
};

export const getGhostContributions = async (
  userId: string,
  workspaceId: string,
  yearMonth: string
) => {
  const goals = await goalRepository.findMany(workspaceId, { status: 'active' });
  const today = startOfTodayUtc();

  return Promise.all(
    goals.map(async (goal) => {
      const currentValueCents = await computeCurrentValueCents(userId, goal);
      const monthsRemaining = monthsBetween(today, goal.targetDate);
      const plannedCents = requiredMonthlyContribution(
        currentValueCents,
        goal.targetAmount,
        monthsRemaining,
        goal.expectedAnnualReturn
      );
      const actualCents = await aggregateMonthContributionCents(userId, goal.categoryId, yearMonth);
      const remainingCents = Math.max(plannedCents - actualCents, 0);

      return {
        goalId: goal._id.toString(),
        goalName: goal.name,
        goalIcon: goal.icon,
        categoryId: goal.categoryId.toString(),
        plannedAmount: fromCents(plannedCents),
        actualAmount: fromCents(actualCents),
        remainingAmount: fromCents(remainingCents),
        satisfied: actualCents >= plannedCents,
      };
    })
  );
};
