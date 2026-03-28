export interface KpiOverviewDto {
  dau: number;
  totalUsers: number;
  activeLast7d: number;
}

export interface LoginEventDto {
  userId: string;
  username: string;
  occurredAt: string;
  picture?: string;
}
