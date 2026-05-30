import { alpha, SxProps, Theme } from '@mui/material';

export const getPrimaryButtonStyle = (): SxProps<Theme> => ({
  borderRadius: '100px',
  textTransform: 'none',
  fontWeight: 700,
  fontSize: '1rem',
  py: 1.25,
  color: '#fff',
  background: (theme) =>
    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
  '&:hover': {
    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.dark} 100%)`,
  },
});

export const getOpenInBrowserBoxStyle = (): SxProps<Theme> => ({
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 1.5,
  textAlign: 'start',
  borderRadius: 3,
  px: 2,
  py: 1.75,
  background: 'rgba(99, 102, 241, 0.12)',
  border: '1px solid rgba(129, 140, 248, 0.35)',
});

export const getOpenBadgeStyle = (): SxProps<Theme> => ({
  flexShrink: 0,
  width: 44,
  height: 44,
  borderRadius: '50%',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.18)',
});

export const getOpenHintStyle = (): SxProps<Theme> => ({
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0.5,
  color: 'rgba(255, 255, 255, 0.55)',
});

export const getDividerStyle = (): SxProps<Theme> => ({
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '0.8rem',
  '&::before, &::after': {
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});

export const getCopyButtonStyle = (): SxProps<Theme> => ({
  borderRadius: '100px',
  textTransform: 'none',
  fontWeight: 600,
  px: 3,
  color: 'rgba(255, 255, 255, 0.85)',
  borderColor: 'rgba(255, 255, 255, 0.25)',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
});

export const getUrlTextStyle = (): SxProps<Theme> => ({
  color: 'rgba(255, 255, 255, 0.45)',
  userSelect: 'all',
  wordBreak: 'break-all',
});
