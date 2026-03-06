import EntityError from '@/components/entities/EntityError';
import { useCategories } from '@/hooks/entities/useCategories';
import { useTransactions } from '@/hooks/entities/useTransactions';
import { useBudgets } from '@/hooks/entities/useBudgets';
import BudgetsSkeleton from '@/pages/Budgets/components/BudgetsSkeleton';
import BudgetsList from '@/pages/Budgets/components/BudgetsList';
import { CategoryDto } from '@/types/Category';
import { Button, Typography } from '@mui/material';
import Column from '@/components/shared/layout/containers/Column';
import { useTranslation } from 'react-i18next';
import { BudgetDto } from '@/types/Budget';
import AddIcon from '@mui/icons-material/Add';

interface BudgetsPageContentProps {
  year: number;
  month: number;
  onSetBudget: (category: CategoryDto, budget: BudgetDto) => void;
  onCreateBudget: () => void;
}

const BudgetsPageContent = ({
  year,
  month,
  onSetBudget,
  onCreateBudget,
}: BudgetsPageContentProps) => {
  const { t } = useTranslation('budget');
  const { isLoading: isCategoriesLoading, error, refetch } = useCategories();
  const { isLoading: isTransactionsLoading } = useTransactions(year, month);
  const { budgets, isLoading: isBudgetsLoading } = useBudgets(year, month);

  const isLoading = isCategoriesLoading || isTransactionsLoading || isBudgetsLoading;

  if (error) {
    return <EntityError entityName={'categories'} refetch={refetch} />;
  }

  if (isLoading) {
    return <BudgetsSkeleton />;
  }

  if (!budgets.length) {
    return (
      <Column flex={1} alignItems="center" justifyContent="center" spacing={2}>
        <Typography color="text.secondary">{t('noBudget')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onCreateBudget}>
          {t('createBudget')}
        </Button>
      </Column>
    );
  }

  return <BudgetsList year={year} month={month} onSetBudget={onSetBudget} />;
};

export default BudgetsPageContent;
