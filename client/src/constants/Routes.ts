export const ROUTES = {
  DASHBOARD_URL: '/dashboard',
  TRANSACTIONS_URL: '/transactions',
  CATEGORIES_URL: '/categories',
  PAYMENT_METHODS_URL: '/payment-methods',
  BUDGET_URL: '/budget',
  PLANNER_URL: '/planner',
  REPORTS_URL: '/reports',
  ACCOUNTS_URL: '/accounts',
  LOGIN_URL: '/login',
  TERMS_OF_SERVICE_URL: '/terms-of-service',
  PRIVACY_POLICY_URL: '/privacy-policy',
} as const;

export const API_ROUTES = {
  AUTH: {
    GOOGLE_LOGIN: '/api/auth/google-login',
    ACCEPT_TERMS: '/api/auth/accept-terms',
    ME: '/api/auth/me',
  },

  FEEDBACK: '/api/feedback',

  TRANSACTIONS: '/api/transactions',
  TRANSACTION_SUMMARY: (year: number, month?: number, accountId?: string) => {
    const params = new URLSearchParams({ year: String(year) });

    if (month !== undefined) {
      params.append('month', String(month));
    }

    if (accountId) {
      params.append('accountId', accountId);
    }

    return `/api/transactions/summary?${params.toString()}`;
  },

  ACCOUNTS: '/api/accounts',
  ACCOUNT_SYNC_BALANCE: (accountId: string) => `/api/accounts/${accountId}/sync-balance`,
  ACCOUNT_BALANCE_CURVE: (accountId: string) => `/api/accounts/${accountId}/balance-curve`,

  CATEGORIES: '/api/categories',

  PAYMENT_METHODS: '/api/payment-methods',

  USERS: '/api/users',
};
