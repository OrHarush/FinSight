import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { alpha, IconButton, useTheme } from '@mui/material';

import Row from '@/components/shared/layout/containers/Row';
import { usePageHeaderContext } from '@/components/shared/layout/PageHeaderContext';
import DateSelector from '@/components/shared/ui/DateSelector';
import LanguageSelect from '@/components/shared/ui/LanguageSelect';
import { useAppTheme } from '@/providers/AppThemeProvider';

const Controls = () => {
  const theme = useTheme();
  const { toggleColorMode } = useAppTheme();
  const { showDateSelector, dateConfig } = usePageHeaderContext();

  return (
    <Row spacing={2} sx={{ marginInlineStart: 'auto' }}>
      {showDateSelector && dateConfig && (
        <DateSelector value={dateConfig.value} onChange={dateConfig.onChange} />
      )}
      <Row spacing={1}>
        <LanguageSelect sx={{ width: 40, height: 40, backgroundColor: 'transparent' }} />
        <IconButton
          onClick={toggleColorMode}
          size="small"
          sx={{
            width: 40,
            height: 40,
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
      </Row>
    </Row>
  );
};

export default Controls;
