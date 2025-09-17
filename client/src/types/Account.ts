export interface AccountFormValues {
  name: string;
  balance: string;
  institution: string;
  accountNumber: string;
}

export interface AccountDto {
  _id: string;
  name: string;
  balance: number;
  institution: string;
  accountNumber: string;
  lastSynced: Date;
}
