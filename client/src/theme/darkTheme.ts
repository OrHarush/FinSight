import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c88ff', // soft purple
    },
    secondary: {
      main: '#00cec9', // teal
    },
    error: {
      main: '#ff7675', // coral red
    },
    background: {
      default: '#121212', // dark base
      paper: '#1d1d1d', // slightly lighter surface
    },
    text: {
      primary: '#f5f6fa', // very light grey-white
      secondary: '#a4b0be', // muted grey
    },
    divider: 'rgba(255,255,255,0.08)', // subtle divider
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '24px',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
  },
});
