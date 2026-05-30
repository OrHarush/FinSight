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

export const getErrorContainerStyle = (): SxProps<Theme> => ({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  background: 'radial-gradient(circle at 50% 35%, #1a1430 0%, #0d0d12 60%, #08080b 100%)',
});

export const getErrorContentStyle = (): SxProps<Theme> => ({
  position: 'relative',
  zIndex: 1,
  textAlign: 'center',
  px: 3,
  maxWidth: 440,
});

export const getErrorTitleStyle = (): SxProps<Theme> => ({
  mt: 4,
  fontWeight: 700,
  fontSize: '2rem',
  letterSpacing: '-0.02em',
  color: 'common.white',
  textShadow: '0 0 24px rgba(156, 136, 255, 0.35)',
});

export const getErrorSubtitleStyle = (): SxProps<Theme> => ({
  mt: 2,
  fontSize: '1.0625rem',
  color: 'rgba(255, 255, 255, 0.65)',
  lineHeight: 1.7,
  whiteSpace: 'pre-line',
});

export const getErrorReloadButtonStyle = (): SxProps<Theme> => ({
  mt: 4,
  gap: 1,
  textTransform: 'none',
  fontWeight: 600,
  px: 4,
  py: 1.25,
  borderRadius: 999,
  color: 'common.white',
  background: 'linear-gradient(135deg, #7c5cff 0%, #9c88ff 100%)',
  boxShadow: '0 8px 24px rgba(124, 92, 255, 0.4)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #8b6cff 0%, #ab98ff 100%)',
    boxShadow: '0 10px 32px rgba(124, 92, 255, 0.55)',
    transform: 'translateY(-2px)',
  },
  [REDUCED_MOTION]: {
    transition: 'none',
    '&:hover': { transform: 'none' },
  },
});
