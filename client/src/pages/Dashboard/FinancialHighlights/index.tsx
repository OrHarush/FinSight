import FinanceOverviewCard from '@/pages/Dashboard/FinancialHighlights/FinanceOverviewCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useTransactions } from '@/providers/TransactionsProvider';
import { useAccounts } from '@/providers/AccountsProvider';
import { SvgIconComponent } from '@mui/icons-material';
import { Grid } from '@mui/material';

interface FinanceHighlightCardProps {
  id: string;
  headerTitle: string;
  balance: number;
  icon: SvgIconComponent;
  isLoading: boolean;
}

const FinancialHighlights = () => {
  const { transactions, isLoading: isLoadingTransactions } = useTransactions();
  const { accounts, isLoading: isLoadingAccounts } = useAccounts();

  const bankAccount = accounts.find(account => account.name.toLowerCase().includes('balance'));
  const investmentAccount = accounts.find(account =>
    account.name.toLowerCase().includes('investment')
  );

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const monthlyExpenses = monthlyTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  console.log(bankAccount);

  const FinanceCards: FinanceHighlightCardProps[] = [
    {
      id: bankAccount?._id || 'Error',
      headerTitle: 'Balance',
      balance: bankAccount?.balance || 0,
      icon: AccountBalanceWalletIcon,
      isLoading: isLoadingAccounts,
    },
    {
      id: '1232234',
      headerTitle: 'Total Monthly Expenses',
      balance: monthlyExpenses || 0,
      icon: AccountBalanceWalletIcon,
      isLoading: isLoadingTransactions,
    },
    {
      id: '12323224',
      headerTitle: 'End of Month Balance',
      balance: (bankAccount?.balance || 0) - monthlyExpenses || 0,
      icon: AccountBalanceWalletIcon,
      isLoading: isLoadingAccounts,
    },
    {
      id: investmentAccount?._id || '123222234',
      headerTitle: 'Investments',
      balance: investmentAccount?.balance || 0,
      icon: AccountBalanceWalletIcon,
      isLoading: isLoadingAccounts,
    },

    // {
    //   headerTitle: 'Net Income',
    //   balance: 10000,
    //   icon: AccountBalanceIcon,
    // },
    // {
    //   headerTitle: 'Monthly Expenses',
    //   balance: 10000,
    //   icon: AccountBalanceIcon,
    // },
  ];

  return (
    <Grid container spacing={2} width="100%">
      {FinanceCards.map(card => (
        <Grid key={card.id} size={{ xs: 6, md: 3 }}>
          <FinanceOverviewCard
            headerTitle={card.headerTitle}
            balance={card.balance}
            icon={card.icon}
            isLoading={card.isLoading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default FinancialHighlights;
