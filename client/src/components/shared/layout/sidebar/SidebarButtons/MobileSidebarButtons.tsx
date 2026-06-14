import { Box, List } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import AdminNavigation from '@/components/shared/layout/sidebar/SidebarButtons/AdminNavigation';
import {
  buildAdminNavigationButtons,
  manageNavigation,
} from '@/components/shared/layout/sidebar/SidebarButtons/sidebarButtonUtils';
import SidebarNavigationButton from '@/components/shared/layout/sidebar/SidebarButtons/SidebarNavigationButton';
import { SidebarButtonsStyles } from '@/components/shared/layout/sidebar/SidebarButtons/styles';
import { useAuth } from '@/providers/AuthProvider';
import { isAdmin } from '@/utils/env';

const MobileSidebarButtons = () => {
  const { t } = useTranslation('sidebar');
  const location = useLocation();
  const { user } = useAuth();

  const adminNavigation = buildAdminNavigationButtons(isAdmin(user));
  const rows = [...manageNavigation, ...adminNavigation];
  const activeIndex = rows.findIndex(button => location.pathname === button.route);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={SidebarButtonsStyles(activeIndex)} />
      <List sx={{ position: 'relative', zIndex: 1 }}>
        {manageNavigation.map(button => (
          <SidebarNavigationButton
            key={button.titleKey}
            button={button}
            isActive={location.pathname === button.route}
            title={t(button.titleKey)}
          />
        ))}
        <AdminNavigation adminNavigation={adminNavigation} />
      </List>
    </Box>
  );
};

export default MobileSidebarButtons;
