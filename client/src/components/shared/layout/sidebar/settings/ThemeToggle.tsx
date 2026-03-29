import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton, ToggleButton, ToggleButtonGroup, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Row from '@/components/shared/layout/containers/Row';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';
import { useAppTheme } from '@/providers/AppThemeProvider';

const ThemeToggle = () => {
  const { t } = useTranslation('sidebar');
  const { toggleColorMode } = useAppTheme();
  const theme = useTheme();
  const { expanded } = useSidebar();

  const handleThemeChange = (event: React.MouseEvent<HTMLElement>, newMode: string | null) => {
    if (newMode !== null && newMode !== theme.palette.mode) {
      toggleColorMode();
    }
  };

  if (!expanded) {
    const isDark = theme.palette.mode === 'dark';

    return (
      <IconButton onClick={toggleColorMode} size="small">
        {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
      </IconButton>
    );
  }

  return (
    <ToggleButtonGroup
      value={theme.palette.mode}
      exclusive
      onChange={handleThemeChange}
      fullWidth
      sx={{
        '& .MuiToggleButton-root': {
          py: 1,
          textTransform: 'none',
          fontWeight: 500,
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
      }}
    >
      <ToggleButton value="light">
        <Row spacing={1} alignItems="center">
          <LightModeIcon fontSize="small" />
          <span>{t('theme.light')}</span>
        </Row>
      </ToggleButton>
      <ToggleButton value="dark">
        <Row spacing={1} alignItems="center">
          <DarkModeIcon fontSize="small" />
          <span>{t('theme.dark')}</span>
        </Row>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ThemeToggle;
