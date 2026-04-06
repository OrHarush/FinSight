import { SxProps, Theme } from '@mui/material';

export const getLegalPageContainerStyle = (): SxProps<Theme> => ({
  maxWidth: '900px',
  margin: '0 auto',
  padding: { xs: 2, sm: 3, md: 4 },
  minHeight: '100dvh',
});
