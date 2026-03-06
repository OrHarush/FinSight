import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Collapse,
  IconButton,
  LinearProgress,
  Chip,
  Button,
  useTheme,
} from '@mui/material';
import { CategoryDto } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import { BudgetDto } from '@/hooks/entities/useBudgets';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';
import { getBudgetProgressColor } from '@/utils/colorUtils';
import CategoryIconFrame from '@/components/features/categories/CategoryIconFrame';

interface BudgetCategoryRowProps {
  category: CategoryDto;
  spent: number;
  budget?: BudgetDto;
  transactions: TransactionDto[];
  onSetBudget: () => void;
}

const BudgetCategoryRow = ({
  category,
  spent,
  budget,
  transactions,
  onSetBudget,
}: BudgetCategoryRowProps) => {
  const { t } = useTranslation('budget');
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const percentage = budget ? Math.min((spent / budget.limit) * 100, 100) : 0;
  const categoryTransactions = transactions.filter(tx => tx.category?._id === category._id);

  const handleBudgetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSetBudget();
  };

  console.log(budget);

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': { borderColor: category.color, boxShadow: 2 },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Row
          alignItems="center"
          justifyContent="space-between"
          sx={{ cursor: 'pointer' }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Row alignItems="center" spacing={2} flex={1}>
            <CategoryIconFrame color={category.color} icon={category.icon} />
            <Column spacing={0.5} flex={1}>
              <Typography variant="body1" fontWeight={600}>
                {category.name}
              </Typography>
              <Row spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  ₪{spent.toLocaleString()} {budget && `/ ₪${budget.limit.toLocaleString()}`}
                </Typography>
                {budget && (
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
                )}
              </Row>
              {budget && (
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
              )}
            </Column>
            <Row spacing={1} alignItems="center">
              {budget ? (
                <IconButton size="small" onClick={handleBudgetClick} title="Edit Budget">
                  <EditIcon fontSize="small" />
                </IconButton>
              ) : (
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleBudgetClick}
                  sx={{ minWidth: 'auto', px: 1.5 }}
                >
                  {t('setBudget')}
                </Button>
              )}
              <IconButton size="small">
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Row>
          </Row>
        </Row>
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              {categoryTransactions.length} {t('transactions.title')}
            </Typography>
            {categoryTransactions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                {t('transactions.noTransactions')}
              </Typography>
            ) : (
              <Column spacing={1}>
                {categoryTransactions.map(tx => (
                  <Box
                    key={tx._id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: 'action.hover',
                      '&:hover': { backgroundColor: 'action.selected' },
                    }}
                  >
                    <Row justifyContent="space-between" alignItems="center">
                      <Column spacing={0}>
                        <Typography variant="body2" fontWeight={500}>
                          {tx.name || 'No description'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {tx.date ? new Date(tx.date).toLocaleDateString() : 'No date'}
                          {tx.account && ` • ${tx.account.name}`}
                        </Typography>
                      </Column>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="error.main"
                        sx={{ ml: 2 }}
                      >
                        -₪{tx.amount.toLocaleString()}
                      </Typography>
                    </Row>
                  </Box>
                ))}
              </Column>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default BudgetCategoryRow;
