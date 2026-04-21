import { SxProps, Theme } from '@mui/material';

const FADE_PX = 24;

interface MaskArgs {
  hasOverflow: boolean;
  atStart: boolean;
  atEnd: boolean;
  isRtl: boolean;
}

const buildMaskImage = ({ hasOverflow, atStart, atEnd, isRtl }: MaskArgs): string | undefined => {
  if (!hasOverflow) {
    return undefined;
  }

  const dir = isRtl ? 'to left' : 'to right';
  const leadingStop = atEnd ? 'black 0' : 'transparent 0';
  const trailingStop = atStart ? 'black 100%' : 'transparent 100%';

  return `linear-gradient(${dir}, ${leadingStop}, black ${FADE_PX}px, black calc(100% - ${FADE_PX}px), ${trailingStop})`;
};

export const getScrollRowStyle = (mask: MaskArgs): SxProps<Theme> => {
  const maskImage = buildMaskImage(mask);

  return {
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
    px: 0.25,
    py: 0.25,
    maskImage,
    WebkitMaskImage: maskImage,
  };
};

export const getSkeletonStyle = (): SxProps<Theme> => ({
  borderRadius: 999,
  flexShrink: 0,
});
