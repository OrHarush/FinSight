import { CssBaseline } from '@mui/material';
import { useLayoutEffect } from 'react';

import AndroidInstallDialog from '@/components/dialogs/AndroidInstallDialog';
import IosInstallGuideDialog from '@/components/dialogs/IosInstallGuideDialog';
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary';
import { useOnlineStatus } from '@/hooks/common/useOnlineStatus';
import MaintenancePage from '@/pages/MaintenancePage';
import OfflinePage from '@/pages/OfflinePage';
import AppProviders from '@/providers/AppProviders';
import AppRoutes from '@/routes/AppRoutes';

const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

const App = () => {
  const isOnline = useOnlineStatus();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove('lyra-hide-prerender');
    root.classList.remove('lyra-splash-light');
  }, []);

  if (isMaintenanceMode) {
    return (
      <AppProviders>
        <MaintenancePage />
      </AppProviders>
    );
  }

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
        <CssBaseline />
        <AndroidInstallDialog />
        <IosInstallGuideDialog />
        {/*<MobileConsole />*/}
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  );
};

export default App;
