export interface CreatePaymentMethodCommand {
    name: string;
    type: 'Credit' | 'Debit' | 'BankTransfer' | 'PayPal' | 'Other';
    billingDay?: number;
    last4?: string;
    isPrimary?: boolean;
}

export interface UpdatePaymentMethodCommand {
    name?: string;
    type?: 'Credit' | 'Debit' | 'BankTransfer' | 'PayPal' | 'Other';
    billingDay?: number;
    last4?: string;
    isPrimary?: boolean;
}
