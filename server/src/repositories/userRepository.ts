import User, { IUser } from '../models/User';

export const findByProvider = async (
  provider: string,
  providerId: string
): Promise<IUser | null> => {
  return User.findOne({ 'providers.provider': provider, 'providers.providerId': providerId });
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
  const user = new User(data);
  return user.save();
};

export const saveUser = async (user: IUser): Promise<IUser> => {
  return user.save();
};
