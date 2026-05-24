export const ROUTES = {
  HOME_URL: '/',
  LOGIN_URL: '/login',
  TERMS_OF_SERVICE_URL: '/terms-of-service',
  PRIVACY_POLICY_URL: '/privacy-policy',
  ACCESSIBILITY_URL: '/accessibility',
  OVERVIEW_URL: '/overview',
  TRANSACTIONS_URL: '/transactions',
  CATEGORIES_URL: '/categories',
  PAYMENT_METHODS_URL: '/payment-methods',
  BUDGETS_URL: '/budget',
  GOALS_URL: '/goals',
  GOAL_DETAIL_URL: '/goals/:id',
  PLANNER_URL: '/planner',
  REPORTS_URL: '/reports',
  ACCOUNTS_URL: '/accounts',
  ADMIN_KPIS_URL: '/admin/kpis',
  ADMIN_DEBUG_URL: '/admin/debug',
  CHAT_URL: '/chat',
  IMPORT_URL: '/transactions/import',
} as const;

export const API_ROUTES = {
  AUTH: {
    GOOGLE_LOGIN: '/api/auth/google-login',
    ACCEPT_TERMS: '/api/auth/accept-terms',
    ME: '/api/auth/me',
    DEV_LOGIN: '/api/auth/dev-login',
  },

  FEEDBACK: '/api/feedback',

  TRANSACTIONS: '/api/transactions',
  TRANSACTIONS_EXPORT: (month: string) => `/api/transactions/export?month=${month}`,
  TRANSACTION_QUICK_CHIPS: '/api/transactions/quick-chips',
  RECURRING_TEMPLATES_WITH_TRANSACTIONS: '/api/recurring-templates/with-transactions',
  RECURRING_TEMPLATES_SPLIT: (id: string) => `/api/recurring-templates/${id}/split`,
  RECURRING_TEMPLATES_DEACTIVATE_FROM: (id: string) => `/api/recurring-templates/${id}/deactivate-from`,
  TRANSACTION_SUMMARY: (year: number, month?: number, accountId?: string, from?: string) => {
    const params = new URLSearchParams({ year: String(year) });

    if (month !== undefined) {
      params.append('month', String(month));
    }

    if (accountId) {
      params.append('accountId', accountId);
    }

    if (from) {
      params.append('from', from);
    }

    return `/api/transactions/summary?${params.toString()}`;
  },

  ACCOUNTS: '/api/accounts',
  ACCOUNT_BY_ID: (id: string) => `/api/accounts/${id}`,
  ACCOUNT_BALANCE_CURVE: (accountId: string) => `/api/accounts/${accountId}/balance-curve`,

  CATEGORIES: '/api/categories',

  PAYMENT_METHODS: '/api/payment-methods',
  PAYMENT_METHODS_DEFAULT_BANK_TRANSFER: '/api/payment-methods/defaults/bank-transfer',

  BUDGETS: '/api/budgets',

  GOALS: '/api/goals',
  GOAL_BY_ID: (id: string) => `/api/goals/${id}`,
  GOAL_PROJECTION: (id: string) => `/api/goals/${id}/projection`,
  GOAL_DELETE: (id: string, keepCategory: boolean) =>
    `/api/goals/${id}?keepCategory=${keepCategory}`,
  GOAL_GHOSTS: (month: string) => `/api/goals/ghosts?month=${month}`,

  USERS: '/api/users',
  USERS_ME: '/api/users/me',
  USERS_PREFERENCES: '/api/users/me/preferences',
  USERS_CONSENT: '/api/users/me/consent',
  USERS_EXPORT: '/api/users/me/export',

  ADMIN: '/api/admin',
  ADMIN_USERS: '/api/admin/users',
  ADMIN_RECENT_ACTIVITY: (cursor?: string, limit?: number) => {
    const params = new URLSearchParams();

    if (cursor) {
      params.append('cursor', cursor);
    }

    if (limit !== undefined) {
      params.append('limit', String(limit));
    }

    const qs = params.toString();

    return qs ? `/api/admin/analytics/activity?${qs}` : '/api/admin/analytics/activity';
  },
  ADMIN_DEBUG: {
    RUN_FOR_ME: '/api/admin/debug/run-for-me',
    RESTORE_FOR_ME: '/api/admin/debug/restore-for-me',
    SNAPSHOTS: '/api/admin/debug/snapshots',
    BALANCE_BREAKDOWN: (accountId?: string) =>
      accountId
        ? `/api/admin/debug/balance-breakdown?accountId=${encodeURIComponent(accountId)}`
        : '/api/admin/debug/balance-breakdown',
  },

  CHAT: '/api/chat',

  IMPORT_PREVIEW: '/api/import/preview',
  IMPORT_TRANSACTIONS: '/api/import/transactions',
  IMPORT_CHECK_DUPLICATES: '/api/import/check-duplicates',

  ANALYTICS_SHARE_CLICK: '/api/analytics/share-click',
};
