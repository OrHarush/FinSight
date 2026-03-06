import { useState } from 'react';
import { Card, CardContent, Collapse, Box, Typography } from '@mui/material';
import { CategoryDto } from '@/types/Category';
import { TransactionDto } from '@/types/Transaction';
import { BudgetDto } from '@/types/Budget';
import { computeBudgetUsagePercentChange } from '@/utils/budgetUtils';
import { useTranslation } from 'react-i18next';
import BudgetCategoryHeader from '@/pages/Budgets/components/BudgetCategoryRow/BudgetCategoryHeader';
import BudgetTransactionList from '@/pages/Budgets/components/BudgetCategoryRow/BudgetTransactionList';

interface BudgetCategoryRowProps {
  category: CategoryDto;
  spent: number;
  budget: BudgetDto;
  prevBudget?: BudgetDto;
  prevSpent?: number;
  transactions: TransactionDto[];
  onEditBudget: () => void;
}

const BudgetCategoryRow = ({
  category,
  spent,
  budget,
  prevBudget,
  prevSpent,
  transactions,
  onEditBudget,
}: BudgetCategoryRowProps) => {
  const { t } = useTranslation('budget');
  const [isExpanded, setIsExpanded] = useState(false);

  const percentage = Math.min((spent / budget.limit) * 100, 100);
  const categoryTransactions = transactions.filter(tx => tx.category?._id === category._id);
  const usageChange = prevBudget
    ? computeBudgetUsagePercentChange(spent, budget.limit, prevSpent ?? 0, prevBudget.limit)
    : null;

  const toggleExpanded = () => setIsExpanded(prev => !prev);

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
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <BudgetCategoryHeader
          category={category}
          budget={budget}
          spent={spent}
          percentage={percentage}
          usageChange={usageChange}
          isExpanded={isExpanded}
          onEdit={editBudget}
          onToggle={toggleExpanded}
        />
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              {categoryTransactions.length} {t('transactions.title')}
            </Typography>
            <BudgetTransactionList transactions={categoryTransactions} />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default BudgetCategoryRow;
