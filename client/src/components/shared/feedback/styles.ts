import { SxProps, Theme } from '@mui/material';

const RING_SIZE = 200;
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

export const getRingStyle = (delaySeconds: number): SxProps<Theme> => ({
  position: 'absolute',
  width: RING_SIZE,
  height: RING_SIZE,
  borderRadius: '50%',
  border: '1px solid',
  borderColor: 'primary.main',
  opacity: 0,
  '@keyframes sonarPulse': {
    '0%': { transform: 'scale(0.7)', opacity: 0 },
    '20%': { opacity: 0.6 },
    '100%': { transform: 'scale(1.3)', opacity: 0 },
  },
  animation: `sonarPulse 2.4s ease-out ${delaySeconds}s infinite`,
  [REDUCED_MOTION]: {
    animation: 'none',
    opacity: 0,
  },
});

export const getIconStyle = (): SxProps<Theme> => ({
  position: 'relative',
  zIndex: 2,
  width: 110,
  height: 110,
  opacity: 0,
  '@keyframes iconSpring': {
    '0%': { transform: 'scale(0.55)', opacity: 0 },
    '55%': { transform: 'scale(1.1)', opacity: 1 },
    '75%': { transform: 'scale(0.94)' },
    '90%': { transform: 'scale(1.03)' },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
  animation: 'iconSpring 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards',
  [REDUCED_MOTION]: {
    animation: 'none',
    opacity: 1,
    transform: 'scale(1)',
  },
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
