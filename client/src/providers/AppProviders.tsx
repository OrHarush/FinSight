import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { TransactionsProvider } from '@/providers/TransactionsProvider';
import { AccountsProvider } from '@/providers/AccountsProvider';
import { AppThemeProvider } from '@/providers/AppThemeProvider';
import { CategoriesProvider } from '@/providers/CategoriesProovider';

interface AppProvidersProps {
  children?: ReactNode;
}

const queryClient = new QueryClient();

const AppProviders = ({ children }: AppProvidersProps) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AppThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TransactionsProvider>
          <CategoriesProvider>
          <AccountsProvider>{children}</AccountsProvider>
          </CategoriesProvider>
        </TransactionsProvider>
      </QueryClientProvider>
    </AppThemeProvider>
  </LocalizationProvider>
);
export default AppProviders;
