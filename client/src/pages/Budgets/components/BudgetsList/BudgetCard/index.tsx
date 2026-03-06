import { useState } from 'react';
import { Card, CardContent, Collapse, Box, Typography, IconButton } from '@mui/material';
import { CategoryDto } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import { BudgetDto } from '@/types/Budget';
import { computeBudgetUsagePercentChange } from '@/utils/budgetUtils';
import BudgetTransactionList from '@/pages/Budgets/components/BudgetsList/BudgetCard/BudgetTransactionList';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Row from '@/components/shared/layout/containers/Row';
import Column from '@/components/shared/layout/containers/Column';
import BudgetProgressRow from '@/components/features/budgets/BudgetProgressRow';

interface BudgetCategoryRowProps {
  category: CategoryDto;
  spent: number;
  budget: BudgetDto;
  prevBudget?: BudgetDto;
  prevSpent?: number;
  transactions: TransactionDto[];
  onEditBudget: () => void;
}

const BudgetCard = ({
  category,
  spent,
  budget,
  prevBudget,
  prevSpent,
  transactions,
  onEditBudget,
}: BudgetCategoryRowProps) => {
  const { t } = useTranslation('budgets');
  const [isExpanded, setIsExpanded] = useState(false);

  const percentage = Math.min((spent / budget.limit) * 100, 100);
  const categoryTransactions = transactions.filter(tx => tx.category?._id === category._id);
  const usageChange = prevBudget
    ? computeBudgetUsagePercentChange(spent, budget.limit, prevSpent ?? 0, prevBudget.limit)
    : null;

  const toggleExpanded = () => {
    if (categoryTransactions.length === 0) {
      return;
    }

    setIsExpanded(prev => !prev);
  };

  const editBudget = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditBudget();
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': { borderColor: category.color, boxShadow: 2 },
        cursor: categoryTransactions.length > 0 ? 'pointer' : 'default',
      }}
      onClick={() => {
        if (categoryTransactions.length > 0) {
          setIsExpanded(prev => !prev);
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Row spacing={2}>
          <Column flex={1} spacing={0.5}>
            <BudgetProgressRow
              budget={{
                id: category._id,
                name: category.name,
                icon: category.icon,
                color: category.color,
                spent,
                limit: budget.limit,
                percent: percentage,
              }}
              usageChange={usageChange}
            />
            <Typography variant="caption" color="text.secondary" sx={{}}>
              {categoryTransactions.length} {t('transactions.title')}
            </Typography>
          </Column>
          <Row alignItems="center" justifyContent="center" spacing={1}>
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                editBudget(e);
              }}
              title={t('editBudget')}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                toggleExpanded();
              }}
              disabled={categoryTransactions.length === 0}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Row>
        </Row>
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <BudgetTransactionList transactions={categoryTransactions} />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
