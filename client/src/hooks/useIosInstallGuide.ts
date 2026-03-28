import { useCallback, useState } from 'react';

interface UseIosInstallGuideResult {
  canShow: boolean;
  dismiss: () => void;
}

const DISMISSED_KEY = 'finsight_ios_guide_dismissed_at';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const isIosDevice = (): boolean => /iphone|ipad|ipod/i.test(navigator.userAgent);

const isRunningStandalone = (): boolean =>
  (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

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

export const useIosInstallGuide = (): UseIosInstallGuideResult => {
  const [isDismissed, setIsDismissed] = useState(() => wasRecentlyDismissed());

  const canShow = isIosDevice() && !isRunningStandalone() && !isDismissed;

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setIsDismissed(true);
  }, []);

  return { canShow, dismiss };
};
