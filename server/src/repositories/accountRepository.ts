import Account, { IAccount } from '../models/Account';

export const findAll = async (): Promise<IAccount[]> => {
  return Account.find();
};

export const findById = async (id: string): Promise<IAccount | null> => {
  return Account.findById(id);
};

export const create = async (data: Partial<IAccount>): Promise<IAccount> => {
  const account = new Account(data);
  return account.save();
};

export const update = async (id: string, data: Partial<IAccount>): Promise<IAccount | null> => {
  return Account.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id: string): Promise<IAccount | null> => {
  return Account.findByIdAndDelete(id);
};
