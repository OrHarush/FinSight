import { SxProps, Theme } from '@mui/material';

export const getBannerStyle = (isMobile: boolean): SxProps<Theme> => ({
  position: 'fixed',
  zIndex: theme => theme.zIndex.snackbar + 1,
  left: isMobile ? 8 : 16,
  right: isMobile ? 8 : 16,
  bottom: isMobile ? 8 : 16,
  maxWidth: isMobile ? 'none' : 720,
  mx: isMobile ? 0 : 'auto',
  p: 2,
  borderRadius: 2,
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  alignItems: isMobile ? 'stretch' : 'center',
  gap: 2,
  bgcolor: 'background.paper',
  border: theme => `1px solid ${theme.palette.divider}`,
});
