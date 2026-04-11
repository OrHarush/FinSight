import i18n, { TFunction } from 'i18next';

import { AccountDto } from '@/types/Account';

export const getAccountDisplayName = (
  account: Pick<AccountDto, 'name' | 'key'> | null | undefined,
  t: TFunction<'accounts'>
): string => {
  if (!account) {
    return '';
  }

  if (!account.key) {
    return account.name;
  }

  const defaultName = i18n.getFixedT('en', 'accounts')(`defaults.${account.key}`);

  if (account.name !== defaultName) {
    return account.name;
  }

  return t(`defaults.${account.key}`);
};
