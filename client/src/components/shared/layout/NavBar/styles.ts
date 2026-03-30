import { alpha } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export const navBarSx = (theme: Theme): SxProps<Theme> => ({
  position: 'sticky',
  zIndex: theme.zIndex.appBar,
  px: 2,
  height: '54px',
  minHeight: '54px',
  backdropFilter: 'blur(20px)',
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
});
