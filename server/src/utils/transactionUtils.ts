import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import { Types } from 'mongoose';
import { ITransactionPopulated } from '../types/Transaction';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const createRecurringInstance = (
  tx: ITransactionPopulated,
  currentDate: Dayjs
): ITransactionPopulated => {
  const date = currentDate.toDate();

  return {
    ...tx,
    date,
    _id: `${tx._id}-${date.toISOString()}`,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    originalId: tx._id,
  };
};

export const getNextRecurringDate = (
  current: Dayjs,
  isMonthlyRecurrence: boolean,
  dayOfMonth: number
): Dayjs => {
  if (isMonthlyRecurrence) {
    let next = current.add(1, 'month').startOf('month');

    if (dayOfMonth <= next.daysInMonth()) {
      next = next.date(dayOfMonth);
    } else {
      next = next.endOf('month');
    }

    return next;
  }

  return current.add(1, 'year').date(dayOfMonth);
};

export const expandRecurring = (tx: ITransactionPopulated, from: Date, to: Date) => {
  if (tx.recurrence === 'None') {
    if (!tx.date) {
      return [];
    }

    return tx.date >= from && tx.date <= to ? [tx] : [];
  }

  const result: ITransactionPopulated[] = [];

  const start = dayjs.utc(tx.startDate);
  const end = tx.endDate ? dayjs.utc(tx.endDate) : dayjs.utc(to);

  let current = start;

  if (current.isBefore(from, 'day')) {
    if (tx.recurrence === 'Monthly') {
      const diffMonths = dayjs.utc(from).diff(current, 'month');
      current = current.add(diffMonths, 'month');
    } else {
      const diffYears = dayjs.utc(from).diff(current, 'year');
      current = current.add(diffYears, 'year');
    }
  }

  const dayOfMonth = start.date();

  while (current.isSameOrBefore(end, 'day') && current.isSameOrBefore(to, 'day')) {
    if (current.isSameOrAfter(from, 'day')) {
      result.push(createRecurringInstance(tx, current));
    }

    current = getNextRecurringDate(current, tx.recurrence === 'Monthly', dayOfMonth);
  }

  return result;
};

export const expandTransfer = (tx: ITransactionPopulated) => {
  if (tx.type !== 'Transfer' || !tx.fromAccount || !tx.toAccount) {
    return [tx];
  }

  console.log(tx);

  return [
    {
      ...tx,
      _id: `${tx._id}-out`,
      originalId: tx._id,
      account: tx.fromAccount,
      amount: Math.abs(tx.amount),
      category: {
        _id: 'transfer',
        name: 'Transfer',
        icon: 'SwapHoriz',
        color: '#ff6b6b',
        type: 'Expense' as const,
        monthlyLimit: 0,
        userId: new Types.ObjectId(tx.userId),
      },
    } as ITransactionPopulated,
    {
      ...tx,
      _id: `${tx._id}-in`,
      originalId: tx._id,
      account: tx.toAccount,
      amount: Math.abs(tx.amount),
      category: {
        _id: 'transfer',
        name: 'Transfer',
        icon: 'SwapHoriz',
        color: '#51cf66',
        type: 'Income' as const,
        monthlyLimit: 0,
        userId: new Types.ObjectId(tx.userId),
      },
    } as ITransactionPopulated,
  ];
};

export const expandTransactions = (
  transactions: ITransactionPopulated[],
  from: Date,
  to: Date
): ITransactionPopulated[] =>
  transactions.flatMap((tx) => expandRecurring(tx, from, to)).flatMap((tx) => expandTransfer(tx));

export const buildTransactionQuery = (
  userId: string,
  from?: Date,
  to?: Date,
  categoryId?: string,
  paymentMethodId?: string,
  accountId?: string
) => {
  const userObjId = new Types.ObjectId(userId);

  const query: any = {
    userId: userObjId,
  };

  if (from || to) {
    const dateRange: any = {};
    if (from) {
      dateRange.$gte = from;
    }

    if (to) {
      dateRange.$lte = to;
    }

    const nonRecurring = {
      recurrence: 'None',
      date: dateRange,
    };

    const recurring = {
      recurrence: { $in: ['Monthly', 'Yearly'] },
      startDate: { ...(to && { $lte: to }) },
      $or: [
        { endDate: { $exists: false } },
        { endDate: null },
        ...(from ? [{ endDate: { $gte: from } }] : []),
      ],
    };

    query.$or = [nonRecurring, recurring];
  }

  if (categoryId) {
    query.category = new Types.ObjectId(categoryId);
  }

  if (paymentMethodId) {
    query.paymentMethod = new Types.ObjectId(paymentMethodId);
  }

  if (accountId) {
    const accId = new Types.ObjectId(accountId);
    query.$and = query.$and || [];
    query.$and.push({
      $or: [{ account: accId }, { fromAccount: accId }, { toAccount: accId }],
    });
  }

  return query;
};

export const filterTransactionsByDateRange = (
  transactions: ITransactionPopulated[],
  from?: Date,
  to?: Date
) =>
  transactions.filter((tx) => {
    const txDate = dayjs(tx.date);

    if (from && txDate.isBefore(from, 'day')) {
      return false;
    }

    return !((to && txDate.isSame(to, 'day')) || txDate.isAfter(to, 'day'));
  });

export const sortAndPaginate = (
  data: any[],
  sort: 'asc' | 'desc' = 'desc',
  page?: number,
  limit?: number
) => {
  const sorted = [...data].sort((a, b) => {
    const aDate = new Date(a.date).getTime();
    const bDate = new Date(b.date).getTime();
    return sort === 'asc' ? aDate - bDate : bDate - aDate;
  });

  const total = sorted.length;
  const paginated = page && limit ? sorted.slice((page - 1) * limit, page * limit) : sorted;

  return {
    data: paginated,
    pagination:
      page && limit
        ? {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          }
        : undefined,
  };
};

export function getEffectiveMonth(tx: ITransactionPopulated) {
  const date = dayjs(tx.date);

  if (tx.type === 'Transfer') {
    return { year: date.year(), month: date.month() };
  }

  const pm = tx.paymentMethod;

  if (pm && pm.type === 'Credit' && typeof pm.billingDay === 'number') {
    const billingDay = pm.billingDay;

    if (date.date() < billingDay) {
      const prev = date.subtract(1, 'month');

      return { year: prev.year(), month: prev.month() };
    }

    return { year: date.year(), month: date.month() };
  }

  if (tx.belongToPreviousMonth) {
    const prev = date.subtract(1, 'month');

    return { year: prev.year(), month: prev.month() };
  }

  return { year: date.year(), month: date.month() };
}

export function getEffectiveBalanceDate(tx: ITransactionPopulated): Date {
  if (!tx.date) {
    throw new Error('Transaction date is required for balance calculation');
  }

  const date = dayjs.utc(tx.date);
  const pm = tx.paymentMethod;

  if (pm?.type === 'Credit' && typeof pm.billingDay === 'number') {
    const billingDay = pm.billingDay;

    if (date.date() < billingDay) {
      return date.date(billingDay).toDate();
    }

    const nextMonth = date.add(1, 'month');
    const safeDay = Math.min(billingDay, nextMonth.daysInMonth());

    return nextMonth.date(safeDay).toDate();
  }

  return date.toDate();
}

export const summarizeSingleMonth = (
  txs: ITransactionPopulated[],
  targetYear: number,
  targetMonth: number,
  accountId?: string
) => {
  let monthlyIncome = 0;
  let monthlyExpenses = 0;

  for (const tx of txs) {
    const { year, month } = getEffectiveMonth(tx);
    // console.log({ name: tx.name, amount: tx.amount, date: tx.date, type: tx.type });

    if (year !== targetYear || month !== targetMonth) {
      continue;
    }

    if (tx.type !== 'Transfer') {
      if (!accountId || tx.account?._id.toString() === accountId) {
        if (tx.category?.type === 'Income') {
          monthlyIncome += tx.amount;
        }
        if (tx.category?.type === 'Expense') {
          monthlyExpenses += tx.amount;
        }
      }
    }

    if (tx.type === 'Transfer' && accountId) {
      if (tx.fromAccount?._id.toString() === accountId) {
        monthlyExpenses += tx.amount;
      }
      if (tx.toAccount?._id.toString() === accountId) {
        monthlyIncome += tx.amount;
      }
    }
  }

  return { monthlyIncome, monthlyExpenses };
};

export const summarizeWholeYear = (
  txs: ITransactionPopulated[],
  year: number,
  accountId?: string
) => {
  const buckets = Array.from({ length: 12 }, (_, m) => ({
    month: m,
    monthlyIncome: 0,
    monthlyExpenses: 0,
  }));

  for (const tx of txs) {
    const { year: effYear, month: effMonth } = getEffectiveMonth(tx);

    if (effYear !== year) continue;

    if (tx.type !== 'Transfer') {
      if (!accountId || tx.account?._id.toString() === accountId) {
        if (tx.category?.type === 'Income') {
          buckets[effMonth].monthlyIncome += tx.amount;
        }
        if (tx.category?.type === 'Expense') {
          buckets[effMonth].monthlyExpenses += tx.amount;
        }
      }
    }

    if (tx.type === 'Transfer' && accountId) {
      if (tx.fromAccount?._id.toString() === accountId) {
        buckets[effMonth].monthlyExpenses += tx.amount;
      }

      if (tx.toAccount?._id.toString() === accountId) {
        buckets[effMonth].monthlyIncome += tx.amount;
      }
    }
  }

  return buckets;
};
