import { ThemeOptions } from '@mui/material';
import dayjs from 'dayjs';
import {} from '@mui/x-date-pickers/themeAugmentation';

export const commonTheme: ThemeOptions = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          height: '40px',
          borderRadius: '10px',
          fontWeight: 600,
          boxShadow: 'none',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        outlined: {
          backdropFilter: 'blur(20px)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          height: '40px',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.08)',
        },
        // elevation1: {
        //   backgroundColor: 'rgba(21, 27, 36, 0.7)',
        //   boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
        // },
        // elevation2: {
        //   boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
        // },
        // elevation3: {
        //   boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
        // },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(40px)',
          borderRadius: '20px',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(40px)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(148, 163, 184, 0.08)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backdropFilter: 'blur(20px)',
          borderRadius: '8px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backdropFilter: 'blur(20px)',
          fontWeight: 500,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          padding: 8,
        },
        track: {
          borderRadius: 12,
        },
        thumb: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiDatePicker: {
      defaultProps: {
        minDate: dayjs().subtract(5, 'year'),
        maxDate: dayjs().add(2, 'year'),
        slotProps: {
          textField: {
            size: 'small',
            sx: { width: 200 },
          },
          popper: {
            sx: {
              '& .MuiDateCalendar-root': {
                height: 'auto',
                minHeight: 'unset',
                paddingBottom: 1,
              },
              '& .MuiDayCalendar-root': {
                display: 'none',
              },
              '& .MuiPaper-root': {
                backdropFilter: 'blur(40px)',
                borderRadius: '16px',
              },
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: `"Public Sans", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    button: { textTransform: 'none', fontWeight: 600 },
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
};
