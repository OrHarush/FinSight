import { IPaymentMethod } from '../models/PaymentMethod';
import { ITransaction } from '../models/Transaction';
import { ICategory } from '../models/Category';
import { IAccount } from '../models/Account';

export interface TransactionQueryOptions {
  page?: number;
  limit?: number;
  from?: Date;
  to?: Date;
  targetYear?: number;
  targetMonth?: number;
  sort?: 'asc' | 'desc';
  categoryId?: string;
  paymentMethodId?: string;
  accountId?: string;
  search?: string;
}

export interface ITransactionPopulated
  extends Omit<
    ITransaction,
    'category' | 'paymentMethod' | 'account' | 'fromAccount' | 'toAccount'
  > {
  category?: ICategory;
  paymentMethod?: IPaymentMethod;
  account?: IAccount;
  fromAccount?: IAccount;
  toAccount?: IAccount;
}
