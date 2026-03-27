import { useEffect, useState } from 'react';

export const useMinLoadingDuration = (isLoading: boolean, minMs: number): boolean => {
  const [minElapsed, setMinElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinElapsed(true), minMs);

    return () => clearTimeout(timer);
  }, [minMs]);

  return isLoading || !minElapsed;
};
