import { IAccount } from '../models/Account';
import { ICategory } from '../models/Category';
import { IPaymentMethod } from '../models/PaymentMethod';
import { ITransaction } from '../models/Transaction';

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
