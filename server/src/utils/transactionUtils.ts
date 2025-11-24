import dayjs from 'dayjs';
import { ITransaction } from '../models/Transaction';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import utc from 'dayjs/plugin/utc';
import { Types } from 'mongoose';

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

export const expandRecurring = (tx: ITransaction, until: Date): any[] => {
  if (tx.recurrence === 'None') {
    return [tx];
  }

  const result: any[] = [];
  let currentDate = dayjs.utc(tx.startDate);
  const end = tx.endDate ? dayjs.utc(tx.endDate) : dayjs.utc(until);

  const dayOfMonth = currentDate.date();

  while (currentDate.isSameOrBefore(end, 'day')) {
    result.push({
      ...tx.toObject(),
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

export const expandTransfer = (tx: any): any[] => {
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
      },
    },
  ];
};

export const expandTransactions = (transactions: ITransaction[], until: Date): any[] =>
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

export const filterAndExpandTransactions = (transactions: any[], from?: Date, to?: Date) => {
  const expanded = expandTransactions(transactions, to ?? new Date());

  return expanded.filter((tx) => {
    const txDate = dayjs(tx.date);

    if (from && txDate.isBefore(from, 'day')) {
      return false;
    }

    return !((to && txDate.isSame(to, 'day')) || txDate.isAfter(to, 'day'));
  });
};

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
