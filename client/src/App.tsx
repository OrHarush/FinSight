import { CssBaseline } from '@mui/material';
import AppProviders from '@/providers/AppProviders';
import AppRoutes from '@/routes/AppRoutes';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import OfflinePage from '@/pages/OfflinePage';
import MobileConsole from '@/components/MobileConsole';

const App = () => {
  const isOnline = useOnlineStatus();
  //
  // if (!isOnline) {
  //   return (
  //     <AppProviders>
  //       <OfflinePage />
  //     </AppProviders>
  //   );
  // }

  return (
    <ErrorBoundary>
      <AppProviders>
        <CssBaseline />
        <MobileConsole />
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
