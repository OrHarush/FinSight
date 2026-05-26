import { useEffect } from 'react';

import api from '@/api/axios';
import { API_ROUTES } from '@/constants/Routes';
import { useAuth } from '@/providers/AuthProvider';

export const usePwaInstallTracking = () => {
  const { user } = useAuth();

  useEffect(() => {
    const onInstalled = () => {
      if (user?.analyticsConsent !== 'accepted') {
        return;
      }

      void api.post(API_ROUTES.ANALYTICS_PWA_INSTALL).catch(() => {});
    };

    window.addEventListener('appinstalled', onInstalled);

    return () => window.removeEventListener('appinstalled', onInstalled);
  }, [user?.analyticsConsent]);
};
