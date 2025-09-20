import Transaction, { ITransaction } from '../models/Transaction';

export const findAll = async () => {
  return Transaction.find().sort({ date: -1 }).populate('category').populate('account');
};

export const findById = async (id: string) => {
  return Transaction.findById(id).populate('category');
};

export const create = async (data: ITransaction) => {
  const transaction = new Transaction(data);
  return transaction.save();
};

export const update = async (id: string, data: Partial<ITransaction>) => {
  return Transaction.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .populate('category')
    .populate('account');
};

export const remove = async (id: string) => {
  return Transaction.findByIdAndDelete(id).populate('category'); // optional, if you want deleted doc with category
};
