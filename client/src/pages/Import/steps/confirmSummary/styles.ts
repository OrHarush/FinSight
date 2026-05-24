import { alpha, Theme } from '@mui/material';

export const getSummaryCardStyle = {
  p: 2,
  borderRadius: 2,
};

export const getEntityCardStyle = {
  p: 2,
  borderRadius: 1.5,
  height: '100%',
  minHeight: 72,
  display: 'flex',
  alignItems: 'center',
};

export const getEntityIconTileStyle = (theme: Theme) => ({
  width: 38,
  height: 38,
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  bgcolor: alpha(theme.palette.primary.main, 0.12),
});

export const getSkippedChipStyle = (theme: Theme) => ({
  bgcolor: alpha(theme.palette.warning.main, 0.15),
  color: theme.palette.warning.main,
  fontWeight: 600,
  '& .MuiChip-icon': {
    color: theme.palette.warning.main,
  },
});

export const getSummaryDividerStyle = {
  borderColor: 'rgba(148,163,184,0.12)',
};
