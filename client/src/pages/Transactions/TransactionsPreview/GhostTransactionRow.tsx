import CheckIcon from '@mui/icons-material/Check';
import LaunchIcon from '@mui/icons-material/Launch';
import { Chip, IconButton, TableCell, TableRow, Tooltip, Typography, alpha } from '@mui/material';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { categoryIconMap } from '@/constants/categoryIconMap';
import { formatGoalAmount } from '@/pages/Goals/utils/goalFormatters';
import type { GhostContributionDto } from '@/types/Goal';

interface GhostTransactionRowProps {
  ghost: GhostContributionDto;
  color: string;
  onLogContribution: (ghost: GhostContributionDto) => void;
  onOpenDialog: (ghost: GhostContributionDto) => void;
}

const FALLBACK_ICON = 'TrackChanges';
const DASH = '—';

const resolveIcon = (icon?: string | null): ElementType =>
  (icon && categoryIconMap[icon]) || categoryIconMap[FALLBACK_ICON];

const GhostTransactionRow = ({
  ghost,
  color,
  onLogContribution,
  onOpenDialog,
}: GhostTransactionRowProps) => {
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

  const renderNameMeta = () => {
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

    return null;
  };

  return (
    <TableRow
      onClick={openCreateDialog}
      sx={{
        cursor: 'pointer',
        backgroundColor: tintWeak,
        transition: 'background-color 0.15s ease',
        '&:hover': { backgroundColor: tintHover },
        '& > td': {
          borderBottom: '1px dashed',
          borderBottomColor: borderTint,
        },
      }}
    >
      <TableCell>
        <Column spacing={0.25}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }} noWrap>
            {t('ghosts.plannedLabel')}
          </Typography>
          {renderNameMeta()}
        </Column>
      </TableCell>
      <TableCell align="left">
        <Typography
          variant="body2"
          fontWeight={700}
          sx={{
            color,
            textDecoration: ghost.satisfied ? 'line-through' : 'none',
            opacity: ghost.satisfied ? 0.7 : 1,
          }}
          noWrap
        >
          {formatGoalAmount(ghost.plannedAmount)} ₪
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Chip
          icon={<IconComponent sx={{ color }} />}
          label={ghost.goalName}
          variant="outlined"
          sx={{
            width: '160px',
            height: '36px',
            justifyContent: 'flex-start',
            textAlign: 'left',
            padding: '0 12px',
            border: '1px dashed',
            borderColor: borderTint,
            color: 'inherit',
            backgroundColor: tintWeak,
          }}
        />
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" color="text.disabled">
          {DASH}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography variant="body2" color="text.disabled">
          {DASH}
        </Typography>
      </TableCell>
      <TableCell align="left">
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: 'italic' }}
          noWrap
        >
          {ghost.satisfied ? t('ghosts.satisfiedDate') : t('ghosts.dueEndOfMonth')}
        </Typography>
      </TableCell>
      <TableCell align="center">
        <Row justifyContent="center" spacing={0.5}>
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
      </TableCell>
    </TableRow>
  );
};

export default GhostTransactionRow;
