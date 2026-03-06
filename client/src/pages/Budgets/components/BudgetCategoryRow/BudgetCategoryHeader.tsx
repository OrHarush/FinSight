import { Chip, IconButton, LinearProgress, Typography, useTheme } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';
import { getBudgetProgressColor } from '@/utils/colorUtils';
import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';
import BudgetChangeBadge from '@/pages/Budgets/components/BudgetChangeBadge';
import { CategoryDto } from '@/types/Category';
import { BudgetDto } from '@/types/Budget';

interface BudgetCategoryHeaderProps {
  category: CategoryDto;
  budget: BudgetDto;
  spent: number;
  percentage: number;
  usageChange: number | null;
  isExpanded: boolean;
  onEdit: (e: React.MouseEvent) => void;
  onToggle: () => void;
}

const BudgetCategoryHeader = ({
  category,
  budget,
  spent,
  percentage,
  usageChange,
  isExpanded,
  onEdit,
  onToggle,
}: BudgetCategoryHeaderProps) => {
  const { t } = useTranslation('budget');
  const theme = useTheme();

  return (
    <Row
      alignItems="center"
      justifyContent="space-between"
      sx={{ cursor: 'pointer' }}
      onClick={onToggle}
    >
      <Row alignItems="center" spacing={2} flex={1}>
        <CategoryIconFrame color={category.color} icon={category.icon} />
        <Column spacing={0.5} flex={1}>
          <Row alignItems="center" spacing={1}>
            <Typography variant="body1" fontWeight={600}>
              {category.name}
            </Typography>
            {usageChange !== null && <BudgetChangeBadge usageChange={usageChange} />}
          </Row>
          <Row spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              ₪{spent.toLocaleString()} / ₪{budget.limit.toLocaleString()}
            </Typography>
            <Chip
              label={`${Math.round(percentage)}%`}
              size="small"
              sx={{
                backgroundColor: `${getBudgetProgressColor(percentage, theme)}20`,
                color: getBudgetProgressColor(percentage, theme),
                fontWeight: 600,
                height: 24,
              }}
            />
          </Row>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
              height: 10,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.08)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getBudgetProgressColor(percentage, theme),
                borderRadius: 3,
              },
            }}
          />
        </Column>
        <Row spacing={1} alignItems="center">
          <IconButton size="small" onClick={onEdit} title={t('editBudget')}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Row>
      </Row>
    </Row>
  );
};

export default BudgetCategoryHeader;
