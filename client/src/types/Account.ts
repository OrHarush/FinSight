export interface AccountFormValues {
  name: string;
  balance: number;
  institution: string;
  accountNumber: string;
  icon: string;
  isPrimary: boolean;
}

export interface AccountDto {
  _id: string;
  name: string;
  balance: number;
  institution: string;
  accountNumber: string;
  icon: string;
  isPrimary: boolean;
  lastSynced: Date;
}
