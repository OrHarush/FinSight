import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

import i18n from '@/i18n';
import { AppThemeProvider } from '@/providers/AppThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { queryClient } from '@/queryClient';

import { SnackbarProvider } from './SnackbarProvider';

interface AppProvidersProps {
  children?: ReactNode;
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={i18n.language}>
          <AppThemeProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </AppThemeProvider>
        </LocalizationProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);

export default AppProviders;
