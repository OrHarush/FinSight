import { Button, IconButton, Switch, useTheme } from '@mui/material';
import Row from '@/components/Layout/Containers/Row';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppTheme } from '@/providers/AppThemeProvider';
import UserAvatar from '@/components/Layout/Sidebar/UserAvatar';
import Column from '@/components/Layout/Containers/Column';

const Settings = () => {
  const { toggleColorMode } = useAppTheme();
  const theme = useTheme();

  return (
    <Column height={'100%'} padding={2} spacing={1} justifyContent={'flex-end'}>
      <Row>
        <IconButton color="inherit" onClick={toggleColorMode}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Switch
          checked={theme.palette.mode === 'dark'}
          onChange={toggleColorMode}
          color="primary"
        />
      </Row>
      <UserAvatar />
      <Button variant={'outlined'}>Sign Out</Button>
    </Column>
  );
};

export default Settings;
