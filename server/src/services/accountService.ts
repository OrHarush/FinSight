import Account, { IAccount } from '../models/Account';

export const getAccounts = async (): Promise<IAccount[]> => {
  return Account.find();
};

export const createAccount = async (data: Partial<IAccount>): Promise<IAccount> => {
  const account = new Account(data);

  return account.save();
};

export const getAccountById = async (id: string): Promise<IAccount | null> => {
  return Account.findById(id);
};

export const updateAccountBalance = async (
  id: string,
  newBalance: number
): Promise<IAccount | null> => {
  return Account.findByIdAndUpdate(id, { balance: newBalance }, { new: true });
};

export const deleteAccount = async (id: string): Promise<IAccount | null> => {
  return Account.findByIdAndDelete(id);
};
