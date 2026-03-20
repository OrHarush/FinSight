export interface AccountDto {
  _id: string;
  name: string;
  balance: number;
  institution?: string;
  accountNumber?: string;
  icon?: string;
  currency?: string;
  isPrimary: boolean;
  lastSynced?: Date;
}
