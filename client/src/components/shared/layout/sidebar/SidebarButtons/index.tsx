import { Box, List } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import AdminNavigation from '@/components/shared/layout/sidebar/SidebarButtons/AdminNavigation';
import ManagementButtonsNavigation from '@/components/shared/layout/sidebar/SidebarButtons/ManagementButtonsNavigation';
import {
  budgetButton,
  buildAdminNavigationButtons,
  goalsButton,
  manageNavigation,
  primaryNavigation,
} from '@/components/shared/layout/sidebar/SidebarButtons/sidebarButtonUtils';
import SidebarNavigationButton from '@/components/shared/layout/sidebar/SidebarButtons/SidebarNavigationButton';
import { SidebarButtonsStyles } from '@/components/shared/layout/sidebar/SidebarButtons/styles';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';
import { useAuth } from '@/providers/AuthProvider';
import { isAdmin } from '@/utils/env';

const SidebarButtons = () => {
  const { t } = useTranslation('sidebar');
  const location = useLocation();
  const { user } = useAuth();
  const { expanded } = useSidebar();
  const [isManageExpanded, setIsManageExpanded] = useState(false);

  const adminNavigation = buildAdminNavigationButtons(isAdmin(user));

  const showManageItems = isManageExpanded || !expanded;

  const routeRows = [
    ...primaryNavigation,
    budgetButton,
    goalsButton,
    ...(showManageItems ? manageNavigation : []),
    ...adminNavigation,
  ];

  const activeRouteIndex = routeRows.findIndex(button => location.pathname === button.route);
  const activeIndex = expanded && activeRouteIndex >= 4 ? activeRouteIndex + 1 : activeRouteIndex;

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={SidebarButtonsStyles(activeIndex)} />
      <List sx={{ position: 'relative', zIndex: 1 }}>
        {primaryNavigation.map(button => (
          <SidebarNavigationButton
            key={button.titleKey}
            button={button}
            isActive={location.pathname === button.route}
            title={t(button.titleKey)}
          />
        ))}
        <SidebarNavigationButton
          button={budgetButton}
          isActive={location.pathname === budgetButton.route}
          title={t(budgetButton.titleKey)}
        />
        <SidebarNavigationButton
          button={goalsButton}
          isActive={location.pathname === goalsButton.route}
          title={t(goalsButton.titleKey)}
        />
        <ManagementButtonsNavigation
          manageNavigation={manageNavigation}
          isManageExpanded={isManageExpanded}
          onToggle={() => setIsManageExpanded(prev => !prev)}
        />
        <AdminNavigation adminNavigation={adminNavigation} />
      </List>
    </Box>
  );
};

export default SidebarButtons;
