import { Divider } from '@mui/material';
import UserAvatar from '@/components/layout/Sidebar/Settings/UserAvatar';
import Column from '@/components/layout/Containers/Column';
import Row from '@/components/layout/Containers/Row';
import ThemeToggle from '@/components/layout/Sidebar/Settings/ThemeToggle';
import LanguageSelect from '@/components/common/LanguageSelect';
import LegalLinks from '@/pages/Login/LegalLinks';

const Settings = () => (
  <Column height={'100%'} padding={2} spacing={2} justifyContent={'flex-end'}>
    <Row spacing={1} justifyContent="space-between" alignItems="center">
      <ThemeToggle />
      <LanguageSelect />
    </Row>
    <Divider />
    <UserAvatar />
    <LegalLinks />
  </Column>
);

export default Settings;
