import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import SidebarNavigationButton, {
  SidebarButtonConfig,
} from '@/components/shared/layout/sidebar/SidebarButtons/SidebarNavigationButton';

interface AdminNavigationProps {
  adminNavigation: SidebarButtonConfig[];
}

const AdminNavigation = ({ adminNavigation }: AdminNavigationProps) => {
  const { t } = useTranslation('sidebar');
  const location = useLocation();

  return (
    <>
      {adminNavigation.map(button => (
        <SidebarNavigationButton
          key={button.titleKey}
          button={button}
          isActive={location.pathname === button.route}
          title={t(button.titleKey)}
        />
      ))}
    </>
  );
};

export default AdminNavigation;
