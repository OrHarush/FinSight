import { useCallback, useState } from 'react';

import { isIosDevice, isRunningStandalone } from '@/utils/device';

const DISMISSED_KEY = 'finsight_ios_guide_dismissed_at';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const wasRecentlyDismissed = (): boolean => {
  const raw = localStorage.getItem(DISMISSED_KEY);

  if (!raw) {
    return false;
  }

  const timestamp = parseInt(raw, 10);

  if (Number.isNaN(timestamp)) {
    return false;
  }

  return Date.now() - timestamp < DISMISS_TTL_MS;
};

interface UseIosInstallGuideResult {
  canShow: boolean;
  dismiss: () => void;
}

export const useIosInstallGuide = (): UseIosInstallGuideResult => {
  const [isDismissed, setIsDismissed] = useState(() => wasRecentlyDismissed());

  const canShow = isIosDevice() && !isRunningStandalone() && !isDismissed;

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setIsDismissed(true);
  }, []);

  return { canShow, dismiss };
};
