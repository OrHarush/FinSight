import type { GoalStatusValue } from '@lyra/shared';

import { useGoals } from '@/hooks/entities/useGoals';
import GoalsList from '@/pages/Goals/components/GoalsList';
import GoalsEmptyState from '@/pages/Goals/components/GoalsList/GoalsEmptyState';
import GoalsFilterEmptyState from '@/pages/Goals/components/GoalsList/GoalsFilterEmptyState';
import GoalsSkeleton from '@/pages/Goals/GoalsSkeleton';

interface GoalsPageContentProps {
  status: GoalStatusValue;
  onCreate: () => void;
  onBackToActive: () => void;
}

const GoalsPageContent = ({ status, onCreate, onBackToActive }: GoalsPageContentProps) => {
  const { goals, isLoading } = useGoals({ status });

  if (isLoading) {
    return <GoalsSkeleton />;
  }

  if (goals.length === 0) {
    if (status === 'active') {
      return <GoalsEmptyState onCreate={onCreate} />;
    }

    return <GoalsFilterEmptyState status={status} onBackToActive={onBackToActive} />;
  }

  return <GoalsList goals={goals} />;
};

export default GoalsPageContent;
