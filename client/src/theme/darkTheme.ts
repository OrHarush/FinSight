import { createTheme } from '@mui/material';
import { commonTheme } from '@/theme/commonTheme';

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c88ff',
    },
    secondary: {
      main: '#00cec9',
    },
    error: {
      main: '#ff7675',
    },
    background: {
      default: '#121212',
      paper: '#1d1d1d',
    },
    text: {
      primary: '#f5f6fa',
      secondary: '#a4b0be',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
});
