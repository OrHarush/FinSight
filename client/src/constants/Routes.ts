export const ROUTES = {
  DASHBOARD_URL: '/dashboard',
  TRANSACTIONS_URL: '/transactions',
  CATEGORIES_URL: '/categories',
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

  TRANSACTIONS: '/api/transactions',
  TRANSACTION_SUMMARY: (year: number, month?: number) =>
    month
      ? `/api/transactions/summary?year=${year}&month=${month}`
      : `/api/transactions/summary?year=${year}`,

  CATEGORIES: '/api/categories',

  ACCOUNTS: '/api/accounts',
  ACCOUNT_BALANCE_CURVE: (accountId: string) => `/api/accounts/${accountId}/balance-curve`,

  USERS: '/api/users',
};
