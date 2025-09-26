import { findByProvider, findByEmail, createUser, saveUser } from '../repositories/userRepository';
import { IUser } from '../models/User';

interface AuthPayload {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  picture?: string;
}

export const loginOrRegister = async (payload: AuthPayload): Promise<IUser> => {
  const { provider, providerId, email, name, picture } = payload;

  let user = await findByProvider(provider, providerId);

  if (!user) {
    user = await findByEmail(email);
    if (user) {
      user.providers.push({ provider, providerId });
    } else {
      user = await createUser({
        email,
        name,
        picture,
        providers: [{ provider, providerId }],
      });
    }
    await saveUser(user);
  }

  return user;
};
