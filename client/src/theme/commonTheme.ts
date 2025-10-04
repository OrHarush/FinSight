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
  },
};
