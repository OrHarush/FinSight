import { Button, Divider } from '@mui/material';
import UserAvatar from '@/components/layout/Sidebar/UserAvatar';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { useAuth } from '@/providers/AuthProvider';
import ThemeToggle from '@/components/layout/Sidebar/Settings/ThemeToggle';
import LanguageSelect from '@/components/common/LanguageSelect';
import { useTranslation } from 'react-i18next';

const Settings = () => {
  const { logout } = useAuth();
  const { t } = useTranslation('common');

  return (
    <Column height={'100%'} padding={2} spacing={2} justifyContent={'flex-end'}>
      <Row spacing={1} justifyContent="space-between" alignItems="center">
        <LanguageSelect />
        <ThemeToggle />
      </Row>
      <Divider />
      <UserAvatar />
      <Button variant={'outlined'} onClick={logout} fullWidth>
        {t('buttons.signOut')}
      </Button>
    </Column>
  );
};

export default Settings;
