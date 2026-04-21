import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface MaskState {
  hasOverflow: boolean;
  atStart: boolean;
  atEnd: boolean;
}

const readMaskState = (el: HTMLElement): MaskState => {
  const maxScroll = el.scrollWidth - el.clientWidth;

  if (maxScroll <= 1) {
    return { hasOverflow: false, atStart: true, atEnd: false };
  }

  const abs = Math.abs(el.scrollLeft);

  return {
    hasOverflow: true,
    atStart: abs < 2,
    atEnd: abs > maxScroll - 2,
  };
};

export const useEdgeFadeMask = (contentSignal: unknown) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mask, setMask] = useState<MaskState>({
    hasOverflow: false,
    atStart: true,
    atEnd: false,
  });

  const updateMask = useCallback(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    setMask(readMaskState(el));
  }, []);

  useLayoutEffect(() => {
    updateMask();
  }, [contentSignal, updateMask]);

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    el.addEventListener('scroll', updateMask, { passive: true });
    const observer = new ResizeObserver(updateMask);
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', updateMask);
      observer.disconnect();
    };
  }, [updateMask]);

  return { ref, mask };
};
