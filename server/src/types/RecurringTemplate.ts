import { IAccount } from '../models/Account';
import { ICategory } from '../models/Category';
import { IPaymentMethod } from '../models/PaymentMethod';
import { IRecurringTemplate } from '../models/RecurringTemplate';

export interface IRecurringTemplatePopulated
  extends Omit<
    IRecurringTemplate,
    'category' | 'paymentMethod' | 'account' | 'fromAccount' | 'toAccount'
  > {
  category?: ICategory;
  paymentMethod?: IPaymentMethod;
  account?: IAccount;
  fromAccount?: IAccount;
  toAccount?: IAccount;
}
