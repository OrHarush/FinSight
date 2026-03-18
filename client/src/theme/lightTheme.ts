import { createTheme } from '@mui/material';
import { commonTheme } from '@/theme/commonTheme';

export const lightTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#6c5ce7',
      light: '#a29bfe',
      dark: '#4834d4',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d63031',
      light: '#ff7675',
      dark: '#b71c1c',
      contrastText: '#ffffff',
    },
    success: {
      main: '#059669',
      light: '#34d399',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f1f3f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    divider: 'rgba(15, 23, 42, 0.08)',
    action: {
      active: '#0f172a',
      hover: 'rgba(108, 92, 231, 0.06)',
      selected: 'rgba(108, 92, 231, 0.10)',
      disabled: '#94a3b8',
      disabledBackground: 'rgba(15, 23, 42, 0.05)',
    },
  },
  components: {
    ...commonTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(15, 23, 42, 0.07)',
        },
        elevation1: {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          boxShadow: '0px 2px 8px rgba(15, 23, 42, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.09)',
        },
        elevation3: {
          boxShadow: '0 8px 16px rgba(15, 23, 42, 0.08)',
        },
      },
    },
  },
});
