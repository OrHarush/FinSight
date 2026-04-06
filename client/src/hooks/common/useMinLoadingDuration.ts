import { useEffect, useState } from 'react';

export const useMinLoadingDuration = (isLoading: boolean, minMs: number, enabled: boolean = true): boolean => {
  const [minElapsed, setMinElapsed] = useState(!enabled);

  useEffect(() => {
    if (!enabled) {
      setMinElapsed(true);
      return;
    }

    const timer = setTimeout(() => setMinElapsed(true), minMs);

    return () => clearTimeout(timer);
  }, [minMs, enabled]);

  return isLoading || !minElapsed;
};
