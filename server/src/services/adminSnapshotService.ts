import * as adminService from './adminService';
import * as retentionService from './retentionService';

export interface SnapshotKpis {
  totalUsers: number;
  activeToday: number;
  activeThisWeek: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activatedUsers: number;
  activationRate: number;
}

export interface SnapshotFunnel {
  signedUp: number;
  onboarded: number;
  firstTx: number;
  recurringSet: number;
}

export interface SnapshotFeatureAdoption {
  transactions: number;
  recurring: number;
  csvImport: number;
  customCategories: number;
}

export interface AdminSnapshot {
  generatedAt: string;
  kpis: SnapshotKpis;
  retention: retentionService.RetentionReport;
  funnel: SnapshotFunnel;
  featureAdoption: SnapshotFeatureAdoption;
}

export const getSnapshot = async (): Promise<AdminSnapshot> => {
  const [analytics, retention] = await Promise.all([
    adminService.getAnalytics(),
    retentionService.getRetentionReport(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    kpis: toKpis(analytics),
    retention,
    funnel: toFunnel(analytics),
    featureAdoption: toFeatureAdoption(analytics),
  };
};

const toKpis = (analytics: adminService.AnalyticsOverview): SnapshotKpis => ({
  totalUsers: analytics.totalUsers,
  activeToday: analytics.dau,
  activeThisWeek: analytics.wau,
  newUsersToday: analytics.newUsersToday,
  newUsersThisWeek: analytics.newUsersThisWeek,
  newUsersThisMonth: analytics.newUsersThisMonth,
  activatedUsers: analytics.activatedUsers,
  activationRate: analytics.activationRate,
});

const toFunnel = (analytics: adminService.AnalyticsOverview): SnapshotFunnel => ({
  signedUp: analytics.totalUsers,
  onboarded: analytics.activatedUsers,
  firstTx: analytics.usersWithTransactions,
  recurringSet: analytics.eventCounts.recurring_created,
});

const toFeatureAdoption = (
  analytics: adminService.AnalyticsOverview
): SnapshotFeatureAdoption => ({
  transactions: analytics.eventCounts.transaction_created,
  recurring: analytics.eventCounts.recurring_created,
  csvImport: analytics.eventCounts.csv_imported,
  customCategories: analytics.eventCounts.category_created,
});
