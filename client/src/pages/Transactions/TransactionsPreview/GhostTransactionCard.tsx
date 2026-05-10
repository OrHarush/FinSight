import CheckIcon from '@mui/icons-material/Check';
import LaunchIcon from '@mui/icons-material/Launch';
import { IconButton, Paper, Tooltip, Typography, alpha } from '@mui/material';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { formatGoalAmount } from '@/pages/Goals/utils/goalFormatters';
import type { GhostContributionDto } from '@/types/Goal';

interface GhostTransactionCardProps {
  ghost: GhostContributionDto;
  color: string;
  onLogContribution: (ghost: GhostContributionDto) => void;
  onOpenDialog: (ghost: GhostContributionDto) => void;
}

const FALLBACK_ICON = 'TrackChanges';

const resolveIcon = (icon?: string | null): ElementType =>
  (icon && categoryIconMap[icon]) || categoryIconMap[FALLBACK_ICON];

const GhostTransactionCard = ({
  ghost,
  color,
  onLogContribution,
  onOpenDialog,
}: GhostTransactionCardProps) => {
  const { t } = useTranslation('goals');
  const navigate = useNavigate();
  const IconComponent = resolveIcon(ghost.goalIcon);

  const tintWeak = alpha(color, 0.06);
  const tintHover = alpha(color, 0.12);
  const borderTint = alpha(color, 0.35);

  const checkmarkDisabled = ghost.satisfied || ghost.remainingAmount <= 0;

  const openGoalDetail = () => navigate(`/goals/${ghost.goalId}`);
  const openCreateDialog = () => onOpenDialog(ghost);

  const triggerNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    openGoalDetail();
  };

  const triggerLogContribution = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (checkmarkDisabled) {
      return;
    }

    onLogContribution(ghost);
  };

  const renderSubline = () => {
    if (ghost.satisfied) {
      return (
        <Typography variant="caption" color="success.main" noWrap>
          {t('ghosts.paidMark')}
        </Typography>
      );
    }

    if (ghost.actualAmount > 0) {
      return (
        <Typography variant="caption" color="text.secondary" noWrap>
          {t('ghosts.shortBy', { amount: formatGoalAmount(ghost.remainingAmount) })}
        </Typography>
      );
    }

    return (
      <Typography variant="caption" color="text.secondary" noWrap sx={{ fontStyle: 'italic' }}>
        {t('ghosts.dueEndOfMonth')}
      </Typography>
    );
  };

  return (
    <Paper
      onClick={openCreateDialog}
      sx={{
        p: '14px 16px',
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        cursor: 'pointer',
        boxShadow: 'none',
        borderBottom: '1px dashed',
        borderBottomColor: borderTint,
        backgroundColor: tintWeak,
        transition: 'background-color 0.15s ease',
        '&:hover': { backgroundColor: tintHover },
      }}
    >
      <Column
        sx={{
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          backgroundColor: tintWeak,
          border: '1px dashed',
          borderColor: borderTint,
          flexShrink: 0,
        }}
      >
        <IconComponent sx={{ color }} />
      </Column>
      <Column sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{
            fontStyle: 'italic',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {t('ghosts.plannedLabel')} — {ghost.goalName}
        </Typography>
        {renderSubline()}
      </Column>
      <Typography
        variant="body1"
        fontWeight={700}
        sx={{
          color,
          flexShrink: 0,
          textDecoration: ghost.satisfied ? 'line-through' : 'none',
          opacity: ghost.satisfied ? 0.7 : 1,
        }}
      >
        {formatGoalAmount(ghost.plannedAmount)} ₪
      </Typography>
      <Row spacing={0.25} sx={{ flexShrink: 0 }}>
        <Tooltip title={t('ghosts.actions.logContribution')}>
          <span>
            <IconButton
              size="small"
              onClick={triggerLogContribution}
              disabled={checkmarkDisabled}
              aria-label={t('ghosts.actions.logContribution')}
            >
              <CheckIcon
                fontSize="small"
                sx={{ color: checkmarkDisabled ? 'action.disabled' : 'success.main' }}
              />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={t('ghosts.actions.openGoal')}>
          <IconButton
            size="small"
            onClick={triggerNavigation}
            aria-label={t('ghosts.actions.openGoal')}
          >
            <LaunchIcon fontSize="small" sx={{ color }} />
          </IconButton>
        </Tooltip>
      </Row>
    </Paper>
  );
};

export default GhostTransactionCard;
