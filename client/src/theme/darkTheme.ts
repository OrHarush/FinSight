import { createTheme } from '@mui/material';
import { commonTheme } from '@/theme/commonTheme';

export const darkTheme = createTheme({
  ...commonTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#a78bfa',
      light: '#c4b5fd',
      dark: '#8b5cf6',
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#dc2626',
    },
    success: {
      main: '#34d399',
      light: '#6ee7b7',
      dark: '#059669',
    },
    warning: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    background: {
      default: '#0a0f16',
      paper: '#151b24',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      disabled: '#475569',
    },
    divider: 'rgba(148, 163, 184, 0.12)',
    action: {
      active: '#f8fafc',
      hover: 'rgba(168, 139, 250, 0.08)',
      selected: 'rgba(168, 139, 250, 0.12)',
      disabled: '#475569',
      disabledBackground: 'rgba(148, 163, 184, 0.08)',
    },
  },
  components: {
    ...commonTheme.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.08)',
        },
        elevation1: {
          backgroundColor: 'rgba(21, 27, 36, 0.7)',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
        },
        elevation2: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
        },
        elevation3: {
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
});
