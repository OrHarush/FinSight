import { createTheme } from '@mui/material';
import { commonTheme } from '@/theme/commonTheme';

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#6c5ce7', // vibrant indigo
      light: '#a29bfe',
      dark: '#4834d4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00b894', // teal/green accent
      light: '#55efc4',
      dark: '#009874',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d63031',
      light: '#ff7675',
      dark: '#b71c1c',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9f9fb',
      paper: '#ffffff', // cards & surfaces
    },
    text: {
      primary: '#2d3436', // dark gray for main text
      secondary: '#636e72', // softer gray for secondary
    },
    divider: 'rgba(0,0,0,0.08)',
  },
});
