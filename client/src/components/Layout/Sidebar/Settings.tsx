import { IconButton, Switch, useTheme } from '@mui/material';
import Row from '@/components/Layout/Row';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppTheme } from '@/providers/AppThemeProvider';

const Settings = () => {
  const { toggleColorMode } = useAppTheme();
  const theme = useTheme();

  return (
    <Row padding={2}>
      <IconButton color="inherit" onClick={toggleColorMode}>
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      <Switch checked={theme.palette.mode === 'dark'} onChange={toggleColorMode} color="primary" />
    </Row>
  );
};

export default Settings;
