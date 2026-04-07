import { SxProps, Theme } from '@mui/material';

const REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

export const getLoadingContainerStyle = (): SxProps<Theme> => ({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'background.default',
  overflow: 'hidden',
});

export const getDotGridStyle = (): SxProps<Theme> => ({
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.075) 1px, transparent 1px)
  `,
  backgroundSize: '32px 32px',
  maskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 10%, transparent 75%)',
  WebkitMaskImage: 'radial-gradient(ellipse 55% 55% at 50% 50%, black 10%, transparent 75%)',
  pointerEvents: 'none',
});

export const getSubtitleStyle = (): SxProps<Theme> => ({
  opacity: 0,
  color: 'primary.light',
  '@keyframes fadeUpSubtle': {
    '0%': { opacity: 0, transform: 'translateY(6px)' },
    '100%': { opacity: 0.65, transform: 'translateY(0)' },
  },
  animation: 'fadeUpSubtle 0.5s ease-out 0.55s forwards',
  [REDUCED_MOTION]: {
    animation: 'none',
    opacity: 0.65,
    transform: 'none',
  },
});
