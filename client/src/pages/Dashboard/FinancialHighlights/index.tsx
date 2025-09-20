import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTransactions } from '@/providers/TransactionsProvider';
import { useAccounts } from '@/providers/AccountsProvider';
import { SvgIconComponent } from '@mui/icons-material';
import { Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CalculateIcon from '@mui/icons-material/Calculate';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useDashboardDate } from '@/pages/Dashboard/DashboardDateProvider';

interface FinanceHighlightCardProps {
  id: string;
  headerTitle: string;
  balance: number;
  icon: SvgIconComponent;
  color: string;
  isLoading: boolean;
}

const FinancialHighlights = () => {
  const { transactions, isLoading: isLoadingTransactions } = useTransactions();
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();
  const { selectedYear, selectedMonth } = useDashboardDate();

  const bankAccount = accounts.find(account => account.name.toLowerCase().includes('balance'));

  const monthlyTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getFullYear() === selectedYear && txDate.getMonth() === selectedMonth;
  });

  const { monthlyExpenses, monthlyIncome } = monthlyTransactions.reduce(
    (acc, tx) => {
      const type = tx?.category?.type.toLowerCase();

      if (type === 'expense') {
        acc.monthlyExpenses += tx.amount;
      } else if (type === 'income') {
        acc.monthlyIncome += tx.amount;
      }

      return acc;
    },
    { monthlyExpenses: 0, monthlyIncome: 0 }
  );

  const FinanceCards: FinanceHighlightCardProps[] = [
    {
      id: bankAccount?._id || 'Error',
      headerTitle: 'Balance',
      balance: bankAccount?.balance || 0,
      icon: AccountBalanceWalletIcon,
      isLoading: isLoadingAccounts,
      color: '#6366f1',
    },
    {
      id: 'total-monthly-income',
      headerTitle: 'Income',
      balance: monthlyIncome || 0,
      icon: ShowChartIcon,
      isLoading: isLoadingAccounts,
      color: '#22c55e',
    },
    {
      id: 'total-monthly-expenses',
      headerTitle: 'Total Monthly Expenses',
      balance: monthlyExpenses || 0,
      icon: ShoppingCartIcon,
      isLoading: isLoadingTransactions,
      color: '#ef4444',
    },
    {
      id: 'end-of-month-balance',
      headerTitle: 'End of Month Balance',
      balance: (bankAccount?.balance || 0) + monthlyIncome - monthlyExpenses,
      icon: CalculateIcon,
      isLoading: isLoadingAccounts,
      color: '#f59e0b',
    },
  ];

  return (
    <Grid size={{ xs: 12 }}>
      <Grid container spacing={2} width="100%">
        {FinanceCards.map(card => (
          <Grid key={card.id} size={{ xs: 6, md: 3 }}>
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
