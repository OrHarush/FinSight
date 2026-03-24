import { alpha, Theme } from '@mui/material';

export const getActiveChipSx = (isActive: boolean, theme: Theme) => ({
  cursor: 'pointer',
  height: '40px',
  borderRadius: '8px',
  borderColor: isActive ? theme.palette.primary.main : theme.palette.divider,
  color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
  bgcolor: isActive ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
  '&:hover': {
    bgcolor: isActive
      ? alpha(theme.palette.primary.main, 0.18)
      : theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
});

export const getPopoverPaperSx = (theme: Theme) => ({
  bgcolor: 'background.paper',
  backgroundImage: 'none',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '12px',
  mt: 0.5,
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  minWidth: '200px',
  maxHeight: '360px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  '&::-webkit-scrollbar': { width: '8px' },
  '&::-webkit-scrollbar-track': { background: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    background:
      theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
    borderRadius: '4px',
  },
});
