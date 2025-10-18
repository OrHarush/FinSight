import { Button, Divider } from '@mui/material';
import UserAvatar from '@/components/layout/Sidebar/Settings/UserAvatar';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import { useAuth } from '@/providers/AuthProvider';
import ThemeToggle from '@/components/layout/Sidebar/Settings/ThemeToggle';
import LanguageSelect from '@/components/common/LanguageSelect';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import LegalLinks from '@/pages/Login/LegalLinks';

const Settings = () => {
  const { logout } = useAuth();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate(ROUTES.LOGIN_URL);
  };

  return (
    <Column height={'100%'} padding={2} spacing={2} justifyContent={'flex-end'}>
      <Row spacing={1} justifyContent="space-between" alignItems="center">
        <LanguageSelect />
        <ThemeToggle />
      </Row>
      <Divider />
      <UserAvatar />
      <Button variant={'outlined'} onClick={signOut} fullWidth>
        {t('buttons.signOut')}
      </Button>
      <LegalLinks />
    </Column>
  );
};

export default Settings;
