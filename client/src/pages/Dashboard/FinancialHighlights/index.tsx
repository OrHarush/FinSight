import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { SvgIconComponent } from '@mui/icons-material';
import { Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useDashboardFilters } from '@/pages/Dashboard/DashboardFiltersProvider';
import { useFetch } from '@/hooks/useFetch';
import { TransactionSummaryDto } from '@/types/Transaction';
import { API_ROUTES } from '@/constants/Routes';
import { useAccounts } from '@/hooks/useAccounts';
import { queryKeys } from '@/constants/queryKeys';
import { useTranslation } from 'react-i18next';

interface FinanceHighlightCardProps {
  id: string;
  headerTitle: string;
  balance: number;
  icon: SvgIconComponent;
  color: string;
  isLoading: boolean;
}

const FinancialHighlights = () => {
  const { t } = useTranslation('dashboard');
  const { year, month, account } = useDashboardFilters();
  const { isLoading: isLoadingAccounts } = useAccounts();

  const { data: monthlySummary, isLoading: isLoadingTransactions } =
    useFetch<TransactionSummaryDto>({
      url: API_ROUTES.TRANSACTION_SUMMARY(year, month, account?._id),
      queryKey: queryKeys.transactionSummary(year, month, account?._id || ''),
      enabled: !!year && month >= 0,
    });

  console.log(monthlySummary);

  const monthlyIncome = monthlySummary?.monthlyIncome ?? 0;
  const monthlyExpenses = monthlySummary?.monthlyExpenses ?? 0;

  const FinanceCards: FinanceHighlightCardProps[] = [
    {
      id: account?._id || 'Error',
      headerTitle: t('financialHighlights.currentBalance'),
      balance: account?.balance || 0,
      icon: AccountBalanceWalletIcon,
      isLoading: isLoadingAccounts,
      color: '#6366f1',
    },
    {
      id: 'total-monthly-income',
      headerTitle: t('financialHighlights.income'),
      balance: monthlyIncome || 0,
      icon: ShowChartIcon,
      isLoading: isLoadingAccounts,
      color: '#22c55e',
    },
    {
      id: 'total-monthly-expenses',
      headerTitle: t('financialHighlights.totalMonthlyExpenses'),
      balance: monthlyExpenses || 0,
      icon: ShoppingCartIcon,
      isLoading: isLoadingTransactions,
      color: '#ef4444',
    },
    {
      id: 'end-of-month-balance',
      headerTitle: t('financialHighlights.endOfMonthBalance'),
      balance: (account?.balance || 0) + monthlyIncome - monthlyExpenses,
      icon: CalculateIcon,
      isLoading: isLoadingAccounts,
      color: '#f59e0b',
    },
  ];

  return (
    <Grid size={{ xs: 12 }}>
      <Grid container spacing={2} width="100%">
        {FinanceCards.map(card => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <FinanceOverviewCard
              headerTitle={card.headerTitle}
              balance={card.balance}
              icon={card.icon}
              color={card.color}
              isLoading={card.isLoading}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default FinancialHighlights;
