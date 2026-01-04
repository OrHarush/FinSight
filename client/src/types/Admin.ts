export interface KpiOverviewDto {
  dau: number;
  avgLogins30d: number;
  activeLast7dPercent: number;
}

export interface LoginEventDto {
  userId: string;
  username: string;
  occurredAt: string;
}
