export interface CreateAccountCommand  {
    name: string;
    balance: number;
    institution?: string;
    accountNumber?: string;
    icon?: string;
    currency?: string;
    isPrimary?: boolean;
}

export interface UpdateAccountCommand  {
    name?: string;
    balance?: number;
    institution?: string;
    accountNumber?: string;
    icon?: string;
    currency?: string;
    isPrimary?: boolean;
}