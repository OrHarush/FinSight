import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from '@/theme/darkTheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { TransactionsProvider } from '@/providers/TransactionsProvider';
import { AccountsProvider } from '@/providers/AccountsProvider';

interface AppProvidersProps {
  children?: ReactNode;
}

const queryClient = new QueryClient();

const AppProviders = ({ children }: AppProvidersProps) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={darkTheme}>
      <QueryClientProvider client={queryClient}>
        <TransactionsProvider>
          <AccountsProvider>{children}</AccountsProvider>
        </TransactionsProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </LocalizationProvider>
);
export default AppProviders;
