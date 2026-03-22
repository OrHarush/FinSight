import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Card, CardContent, Collapse, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import BudgetProgressRow from '@/components/features/budgets/BudgetProgressRow';
import TransactionPreviewList from '@/components/features/transactions/TransactionPreviewList';
import Column from '@/components/shared/layout/containers/Column';
import Row from '@/components/shared/layout/containers/Row';
import { useDeleteBudget } from '@/hooks/entities/useBudgetMutations';
import { BudgetDto } from '@/types/Budget';
import { CategoryDto } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import { computeBudgetUsagePercentChange } from '@/utils/budgetUtils';

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
  const deleteBudget = useDeleteBudget();

  const percentage = Math.min((spent / budget.limit) * 100, 100);
  const categoryTransactions = transactions.filter(tx => tx.category?._id === category._id);
  const usageChange = prevBudget
    ? computeBudgetUsagePercentChange(spent, budget.limit, prevSpent ?? 0, prevBudget.limit)
    : null;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBudget.mutate({ budgetId: budget._id });
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(prev => !prev);
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': { borderColor: category.color, boxShadow: 2 },
        cursor: 'pointer',
      }}
      onClick={onEditBudget}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Column spacing={0.5}>
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
                actions={
                  <Row spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={e => {
                        e.stopPropagation();
                        onEditBudget();
                      }}
                      title={t('editBudget')}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={handleDelete}
                      title={t('deleteBudget')}
                      color="error"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Row>
                }
              />
            </Column>
          </Row>
          <Row
            alignItems="center"
            spacing={0.5}
            onClick={handleToggleExpand}
            sx={{ width: 'fit-content' }}
          >
            <Typography variant="caption" color="text.secondary">
              {categoryTransactions.length} {t('transactions.title')}
            </Typography>
            {categoryTransactions.length > 0 && (
              <IconButton size="small">
                {isExpanded ? (
                  <ExpandLessIcon fontSize="small" />
                ) : (
                  <ExpandMoreIcon fontSize="small" />
                )}
              </IconButton>
            )}
          </Row>
        </Column>
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <TransactionPreviewList
              transactions={transactions}
              emptyMessageKey="transactions.noTransactions"
            />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
