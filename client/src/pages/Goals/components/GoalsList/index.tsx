import { Box } from '@mui/material';

import GoalCard from '@/pages/Goals/components/GoalsList/GoalCard';
import type { GoalListItemDto } from '@/types/Goal';

interface GoalsListProps {
  goals: GoalListItemDto[];
}

const GoalsList = ({ goals }: GoalsListProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
      gap: 2,
    }}
  >
    {goals.map(goal => (
      <GoalCard key={goal._id} goal={goal} />
    ))}
  </Box>
);

export default GoalsList;
