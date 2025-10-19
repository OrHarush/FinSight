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
  USERS: '/api/users',
  TRANSACTIONS: '/api/transactions',
  CATEGORIES: '/api/categories',
  ACCOUNTS: '/api/accounts',
};
