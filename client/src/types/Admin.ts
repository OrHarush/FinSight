export type AnalyticsEventType =
  | 'transaction_created'
  | 'recurring_created'
  | 'category_customized'
  | 'csv_imported'
  | 'onboarding_completed';

export interface RecentActivityDto {
  userId: string;
  userName: string;
  userAvatar: string;
  event: AnalyticsEventType;
  createdAt: string;
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
  recentActivity: RecentActivityDto[];
}
