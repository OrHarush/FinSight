import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';

import Column from '@/components/shared/layout/containers/Column';
import { useGhosts } from '@/hooks/entities/useGoals';
import GhostContributionRow from '@/pages/Transactions/TransactionsPreview/GhostContributionRow';

interface GhostContributionsBannerProps {
  month: Dayjs;
}

const isSameMonthAsToday = (month: Dayjs): boolean =>
  month.format('YYYY-MM') === dayjs().format('YYYY-MM');

const GhostContributionsBanner = ({ month }: GhostContributionsBannerProps) => {
  const yearMonth = useMemo(() => month.format('YYYY-MM'), [month]);
  const showGhosts = isSameMonthAsToday(month);

  const { ghosts } = useGhosts(showGhosts ? yearMonth : undefined);

  if (!showGhosts || ghosts.length === 0) {
    return null;
  }

  return (
    <Column spacing={0} sx={{ mb: 1 }}>
      {ghosts.map(ghost => (
        <GhostContributionRow key={ghost.goalId} ghost={ghost} />
      ))}
    </Column>
  );
};

export default GhostContributionsBanner;
