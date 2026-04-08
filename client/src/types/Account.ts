import type { DefaultAccountKey } from '@lyra/shared';

export interface AccountDto {
  _id: string;
  name: string;
  balance: number;
  institution?: string;
  accountNumber?: string;
  icon?: string;
  currency?: string;
  isPrimary: boolean;
  checkpointBalance: number;
  checkpointDate?: Date;
  key?: DefaultAccountKey;
}
