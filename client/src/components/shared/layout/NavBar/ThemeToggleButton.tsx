import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { alpha, IconButton, useTheme } from '@mui/material';

import { useAppTheme } from '@/providers/AppThemeProvider';

const ThemeToggleButton = () => {
  const theme = useTheme();
  const { toggleColorMode } = useAppTheme();

  return (
    <IconButton
      onClick={toggleColorMode}
      size="small"
      sx={{
        width: 36,
        height: 36,
        backgroundColor: 'transparent',
        color: 'text.secondary',
        '&:hover': {
          color: 'text.primary',
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
        },
      }}
    >
      {theme.palette.mode === 'dark' ? (
        <LightModeIcon fontSize="small" />
      ) : (
        <DarkModeIcon fontSize="small" />
      )}
    </IconButton>
  );
};

export default ThemeToggleButton;
