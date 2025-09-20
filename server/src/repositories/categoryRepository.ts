import Category, { ICategory } from '../models/Category';

export const findAll = async () => {
  return Category.find().sort({ createdAt: -1 });
};

export const findById = async (id: string) => {
  return Category.findById(id);
};

export const create = async (data: Partial<ICategory>) => {
  const category = new Category(data);
  return category.save();
};

export const update = async (id: string, data: Partial<ICategory>) => {
  return Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const remove = async (id: string) => {
  return Category.findByIdAndDelete(id);
};
