export interface CreateTransactionCommand {
    name?: string;
    amount: number;
    date: string;
    startDate?: string;
    endDate?: string;
    recurrence: 'None' | 'Monthly' | 'Yearly';
    type: 'Income' | 'Expense' | 'Transfer';
    categoryId?: string;
    paymentMethodId?: string;
    accountId?: string;
    fromAccountId?: string;
    toAccountId?: string;
}

export interface UpdateTransactionCommand  {
    name?: string;
    amount?: number;
    date?: string;
    startDate?: string;
    endDate?: string;
    recurrence?: 'None' | 'Monthly' | 'Yearly';
    type?: 'Income' | 'Expense' | 'Transfer';
    categoryId?: string;
    paymentMethodId?: string;
    accountId?: string;
    fromAccountId?: string;
    toAccountId?: string;}