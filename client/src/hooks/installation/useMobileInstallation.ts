import { useCallback, useEffect, useState } from 'react';

import { isMobileDevice, isRunningStandalone } from '@/utils/device';

const DISMISSED_KEY = 'lyra_install_dismissed_at';
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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UseInstallPromptResult {
  canShow: boolean;
  install: () => Promise<void>;
  dismiss: () => void;
}

export const useMobileInstallation = (): UseInstallPromptResult => {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() => isRunningStandalone());
  const [isDismissed, setIsDismissed] = useState(() => wasRecentlyDismissed());

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!promptEvent) {
      return;
    }

    await promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      localStorage.removeItem(DISMISSED_KEY);
    }

    setPromptEvent(null);
  }, [promptEvent]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setIsDismissed(true);
  }, []);

  return {
    canShow: promptEvent !== null && !isInstalled && !isDismissed && isMobileDevice(),
    install,
    dismiss,
  };
};
