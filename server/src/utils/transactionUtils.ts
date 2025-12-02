import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import { Types } from 'mongoose';
import { ITransactionPopulated } from '../types/Transaction';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

export const expandRecurring = (tx: ITransactionPopulated, until: Date) => {
  if (tx.recurrence === 'None') {
    return [tx];
  }

  const result = [];
  let currentDate = dayjs.utc(tx.startDate);
  const end = tx.endDate ? dayjs.utc(tx.endDate) : dayjs.utc(until);

  const dayOfMonth = currentDate.date();

  while (currentDate.isSameOrBefore(end, 'day')) {
    result.push({
      ...tx,
      date: currentDate.toDate(),
      _id: `${tx._id}-${currentDate.toISOString()}`,
      originalId: tx._id,
    });

    if (tx.recurrence === 'Monthly') {
      let next = currentDate.add(1, 'month').startOf('month');

      if (dayOfMonth <= next.daysInMonth()) {
        next = next.date(dayOfMonth);
      } else {
        next = next.endOf('month');
      }

      currentDate = next;
    } else if (tx.recurrence === 'Yearly') {
      currentDate = currentDate.add(1, 'year').date(dayOfMonth);
    }
  }

  return result;
};

export const expandTransfer = (tx: ITransactionPopulated) => {
  if (tx.type !== 'Transfer' || !tx.fromAccount || !tx.toAccount) {
    return [tx];
  }

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
        type: 'Expense',
        monthlyLimit: 0,
        userId: tx.userId,
      },
    },
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
        type: 'Income',
        monthlyLimit: 0,
        userId: tx.userId,
      },
    },
  ];
};

export const expandTransactions = (
  transactions: ITransactionPopulated[],
  until: Date
): ITransactionPopulated[] =>
  transactions.flatMap((tx) => expandRecurring(tx, until)).flatMap((tx) => expandTransfer(tx));

export const buildTransactionQuery = (
  userId: string,
  from?: Date,
  to?: Date,
  categoryId?: string,
  paymentMethodId?: string,
  accountId?: string
) => {
  const userObjId = new Types.ObjectId(userId);
  const query: any = { userId: userObjId };
  const recurrenceTypes = ['None', 'Monthly', 'Yearly'];

  if (from || to) {
    const dateConditions: any[] = [];

    for (const type of recurrenceTypes) {
      if (type === 'None') {
        const range: any = {};

        if (from) {
          range.$gte = from;
        }

        if (to) {
          range.$lt = to;
        }

        dateConditions.push({ recurrence: 'None', date: range });
      } else {
        dateConditions.push({
          recurrence: type,
          startDate: { $lt: to ?? new Date() },
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            ...(from ? [{ endDate: { $gte: from } }] : []),
          ],
        });
      }
    }

    query.$or = dateConditions;
  }

  if (categoryId) {
    query.category = new Types.ObjectId(categoryId);
  }

  if (paymentMethodId) {
    query.paymentMethod = new Types.ObjectId(paymentMethodId);
  }

  if (accountId) {
    query.$or = [
      { account: new Types.ObjectId(accountId) },
      { fromAccount: new Types.ObjectId(accountId) },
      { toAccount: new Types.ObjectId(accountId) },
    ];
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

export const filterTransactionsByBillingPeriod = (
  transactions: ITransactionPopulated[],
  targetYear: number,
  targetMonth: number
) => {
  const targetStart = new Date(Date.UTC(targetYear, targetMonth, 1, 0, 0, 0, 0));
  const targetEnd = new Date(Date.UTC(targetYear, targetMonth + 1, 0, 23, 59, 59, 999));

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);

    if (!tx.paymentMethod || tx.paymentMethod.type !== 'Credit') {
      return txDate >= targetStart && txDate <= targetEnd;
    }

    const billingDay = tx.paymentMethod.billingDay;

    if (typeof billingDay !== 'number') {
      return txDate >= targetStart && txDate <= targetEnd;
    }

    const { year, month } = getCreditCardEffectiveYearMonth(txDate, billingDay);

    return year === targetYear && month === targetMonth;
  });

  return filteredTransactions;
};

const getCreditCardEffectiveYearMonth = (txDate: Date, billingDay: number) => {
  const day = txDate.getUTCDate();
  let year = txDate.getUTCFullYear();
  let month = txDate.getUTCMonth();

  if (day <= billingDay) {
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }

  return { year, month };
};
