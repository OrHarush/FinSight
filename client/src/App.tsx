import Column from '@/components/layout/Containers/Column';
import { CssBaseline } from '@mui/material';
import AppProviders from '@/providers/AppProviders';
import AppRoutes from '@/routes/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OfflinePage from '@/pages/OfflinePage';

const App = () => {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <AppProviders>
        <OfflinePage />
      </AppProviders>
    );
  }

  return (
    <ErrorBoundary>
      <AppProviders>
        <Column width={'100vw'}>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </Column>
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
