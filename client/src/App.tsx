import { CssBaseline } from '@mui/material';

import AndroidInstallDialog from '@/components/dialogs/AndroidInstallDialog';
import IosInstallGuideDialog from '@/components/dialogs/IosInstallGuideDialog';
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary';
import { useOnlineStatus } from '@/hooks/common/useOnlineStatus';
import OfflinePage from '@/pages/OfflinePage';
import AppProviders from '@/providers/AppProviders';
import AppRoutes from '@/routes/AppRoutes';

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
