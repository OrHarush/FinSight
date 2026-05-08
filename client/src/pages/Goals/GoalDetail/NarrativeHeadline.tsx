import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Column from '@/components/shared/layout/containers/Column';
import { formatGoalAmount, formatLocalizedMonth } from '@/pages/Goals/utils/goalFormatters';
import type { GoalDto, GoalProjectionDto } from '@/types/Goal';

interface NarrativeHeadlineProps {
  goal: GoalDto;
  projection: GoalProjectionDto;
  onMarkAchieved: () => void;
  isMarkingAchieved: boolean;
}

const NarrativeHeadline = ({
  goal,
  projection,
  onMarkAchieved,
  isMarkingAchieved,
}: NarrativeHeadlineProps) => {
  const { t, i18n } = useTranslation('goals');
  const targetDateLabel = formatLocalizedMonth(goal.targetDate, i18n.language);
  const isAchieved = projection.currentValue >= goal.targetAmount;

  if (isAchieved) {
    return (
      <Column spacing={1.5}>
        <Typography variant="h5" fontWeight={700}>
          {t('narrative.achieved', { amount: formatGoalAmount(goal.targetAmount) })}
        </Typography>
        {goal.status !== 'achieved' && (
          <Button
            variant="contained"
            color="success"
            onClick={onMarkAchieved}
            disabled={isMarkingAchieved}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('narrative.markAchievedCta')}
          </Button>
        )}
      </Column>
    );
  }

  if (projection.onTrack) {
    return (
      <Typography variant="h5" fontWeight={700}>
        {t('narrative.onTrack', {
          projected: formatGoalAmount(projection.projectedFinalValue),
          date: targetDateLabel,
          shortfall: formatGoalAmount(goal.targetAmount - projection.projectedFinalValue),
        })}
      </Typography>
    );
  }

  return (
    <Typography variant="h5" fontWeight={700}>
      {t('narrative.offTrack', {
        projected: formatGoalAmount(projection.projectedFinalValue),
        date: targetDateLabel,
        shortfall: formatGoalAmount(projection.shortfall),
      })}
    </Typography>
  );
};

export default NarrativeHeadline;
