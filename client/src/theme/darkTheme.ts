import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          height: '40px',
          borderRadius: '12px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
  },
});
