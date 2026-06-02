import { alpha, Theme } from '@mui/material';

export const getChipStyle = (theme: Theme, isActive: boolean) => ({
  cursor: 'pointer',
  height: 36,
  fontSize: '0.9rem',
  '& .MuiChip-label': {
    px: 1.75,
  },
  borderColor: isActive ? theme.palette.primary.main : theme.palette.divider,
  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
  '&:hover': {
    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.18) : theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
});

export const getPhaseRowStyle = (theme: Theme, state: 'pending' | 'active' | 'done') => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  py: 0.75,
  px: 1,
  borderRadius: 1,
  fontSize: '0.95rem',
  color:
    state === 'done'
      ? theme.palette.text.secondary
      : state === 'active'
        ? theme.palette.text.primary
        : alpha(theme.palette.text.primary, 0.35),
  transition: 'color 200ms ease, opacity 200ms ease',
  opacity: state === 'pending' ? 0.55 : 1,
});

export const getPhaseIconStyle = (theme: Theme, state: 'pending' | 'active' | 'done') => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  color:
    state === 'done'
      ? theme.palette.success.main
      : state === 'active'
        ? theme.palette.primary.main
        : alpha(theme.palette.text.primary, 0.35),
});
