import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { Paper, Typography } from '@mui/material';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { formatGoalAmount } from '@/pages/Goals/utils/goalFormatters';
import type { GhostContributionDto } from '@/types/Goal';

interface GhostContributionRowProps {
  ghost: GhostContributionDto;
}

const resolveHint = (ghost: GhostContributionDto, t: TFunction): string => {
  if (ghost.satisfied) {
    return t('ghosts.satisfied');
  }

  if (ghost.actualAmount > 0) {
    return t('ghosts.partial', {
      actual: formatGoalAmount(ghost.actualAmount),
      remaining: formatGoalAmount(ghost.remainingAmount),
    });
  }

  return t('ghosts.planned', { planned: formatGoalAmount(ghost.plannedAmount) });
};

const resolveDisplayAmount = (ghost: GhostContributionDto): number => {
  if (ghost.satisfied) {
    return ghost.plannedAmount;
  }

  if (ghost.actualAmount > 0) {
    return ghost.remainingAmount;
  }

  return ghost.plannedAmount;
};

const GhostContributionRow = ({ ghost }: GhostContributionRowProps) => {
  const { t } = useTranslation('goals');
  const navigate = useNavigate();

  const hint = resolveHint(ghost, t);
  const displayAmount = resolveDisplayAmount(ghost);
  const strikethrough = ghost.satisfied ? 'line-through' : 'none';

  const goToGoalDetail = () => navigate(`/goals/${ghost.goalId}`);

  return (
    <Paper
      onClick={goToGoalDetail}
      sx={{
        p: 1.25,
        mb: 1,
        cursor: 'pointer',
        backgroundColor: 'transparent',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 2,
        opacity: ghost.satisfied ? 0.55 : 0.9,
        '&:hover': { backgroundColor: 'action.hover' },
      }}
      elevation={0}
    >
      <Row spacing={1.25} alignItems="center">
        <Row
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            backgroundColor: 'action.selected',
            flexShrink: 0,
          }}
        >
          <TrackChangesIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </Row>
        <Column flex={1} spacing={0.25} sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textDecoration: strikethrough,
            }}
          >
            {t('ghosts.label', { name: ghost.goalName })}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {hint}
          </Typography>
        </Column>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            color: 'text.secondary',
            textDecoration: strikethrough,
            flexShrink: 0,
          }}
        >
          {formatGoalAmount(displayAmount)} ₪
        </Typography>
      </Row>
    </Paper>
  );
};

export default GhostContributionRow;
