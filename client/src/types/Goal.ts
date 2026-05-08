import type { GoalImportanceValue, GoalStatusValue } from '@lyra/shared';

import type { CategoryDto } from './Category';

export interface GoalDto {
  _id: string;
  userId: string;
  name: string;
  icon: string | null;
  color: string | null;
  targetAmount: number;
  initialAmount: number;
  targetDate: string;
  expectedAnnualReturn: number;
  importance: GoalImportanceValue;
  description: string | null;
  categoryId: string;
  status: GoalStatusValue;
  category: CategoryDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface GoalListItemDto extends GoalDto {
  currentValue: number;
}

export interface GoalProjectionPoint {
  date: string;
  value: number;
  type: 'actual' | 'projected';
}

export interface GoalProjectionDto {
  goal: GoalDto;
  currentValue: number;
  monthsRemaining: number;
  requiredMonthlyContribution: number;
  projectedFinalValue: number;
  onTrack: boolean;
  shortfall: number;
  contributionsByMonth: Array<{ month: string; amount: number }>;
  projectionPoints: GoalProjectionPoint[];
}

export interface GhostContributionDto {
  goalId: string;
  goalName: string;
  goalIcon: string | null;
  categoryId: string;
  plannedAmount: number;
  actualAmount: number;
  remainingAmount: number;
  satisfied: boolean;
}
