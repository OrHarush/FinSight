import { Chip, Tooltip, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useTranslation } from 'react-i18next';

interface BudgetChangeBadgeProps {
  usageChange: number;
}

const BudgetChangeBadge = ({ usageChange }: BudgetChangeBadgeProps) => {
  const { t } = useTranslation('budget');
  const theme = useTheme();

  const isIncrease = usageChange > 0;
  const color = isIncrease ? theme.palette.error.main : theme.palette.success.main;
  const Icon = isIncrease ? TrendingUpIcon : TrendingDownIcon;
  const sign = isIncrease ? '+' : usageChange < 0 ? '' : '';
  const label = `${sign}${usageChange}%`;

  return (
    <Tooltip title={t('vsLastMonth')} placement="top">
      <Chip
        icon={<Icon sx={{ fontSize: '0.85rem !important', color: `${color} !important` }} />}
        label={label}
        size="small"
        onClick={e => e.stopPropagation()}
        sx={{
          height: 22,
          fontSize: '0.7rem',
          fontWeight: 700,
          backgroundColor: `${color}18`,
          color,
          border: 'none',
          cursor: 'default',
          '& .MuiChip-icon': { ml: 0.5 },
        }}
      />
    </Tooltip>
  );
};

export default BudgetChangeBadge;
