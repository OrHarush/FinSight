import { SxProps, Theme } from '@mui/material';

const REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

/** Outer container — large enough to hold the rings + floating cards without overflow */
export const getVisualOuterStyle = (): SxProps<Theme> => ({
  position: 'relative',
  width: { xs: 300, sm: 380 },
  height: { xs: 256, sm: 300 },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const getFloatingCardWrapperStyle = (delaySeconds: number): SxProps<Theme> => ({
  position: 'absolute',
  zIndex: 3,
  '@keyframes floatY': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-6px)' },
  },
  animation: `floatY 3.2s ease-in-out ${delaySeconds}s infinite`,
  [REDUCED_MOTION]: {
    animation: 'none',
  },
});
