// src/theme/commonTheme.ts
import { ThemeOptions } from '@mui/material';

export const commonTheme: ThemeOptions = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          height: '40px',
          borderRadius: '12px',
          fontWeight: 'bold',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          height: '40px',
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
};
