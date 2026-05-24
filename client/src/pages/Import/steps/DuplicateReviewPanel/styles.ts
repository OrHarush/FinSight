import { SxProps, Theme } from '@mui/material';

export const getSkipToggleStyle = (active: boolean): SxProps<Theme> => ({
  px: 2,
  fontWeight: 600,
  border: 'none',
  ...(active && {
    '&.Mui-selected': {
      bgcolor: 'warning.main',
      color: 'warning.contrastText',
      '&:hover': { bgcolor: 'warning.dark' },
    },
  }),
});

export const getImportToggleStyle = (active: boolean): SxProps<Theme> => ({
  px: 2,
  fontWeight: 600,
  border: 'none',
  ...(active && {
    '&.Mui-selected': {
      bgcolor: 'success.main',
      color: 'success.contrastText',
      '&:hover': { bgcolor: 'success.dark' },
    },
  }),
});
