export type AnalyticsEventType =
  | 'transaction_created'
  | 'transaction_updated'
  | 'transaction_deleted'
  | 'recurring_created'
  | 'category_created'
  | 'csv_imported'
  | 'onboarding_completed'
  | 'accepted_terms'
  | 'goal_created'
  | 'budget_created'
  | 'account_created'
  | 'payment_method_created'
  | 'share_clicked'
  | 'user_created'
  | 'user_deleted';

export interface RecentActivityDto {
  userName: string;
  userAvatar: string;
  event: AnalyticsEventType;
  createdAt: string;
}

export interface RecentActivityPageDto {
  items: RecentActivityDto[];
  nextCursor: string | null;
}

export interface AdminUserDto {
  id: string;
  name: string;
  email: string;
  picture?: string;
  createdAt: string;
  totalTransactions: number;
  lastActiveAt?: string;
  hasCompletedOnboarding: boolean;
}

export interface AnalyticsOverviewDto {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  dau: number;
  wau: number;
  mau: number;
  activatedUsers: number;
  activationRate: number;
  usersWithTransactions: number;
  eventCounts: Record<AnalyticsEventType, number>;
}
