import { Box, List } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import AdminNavigation from '@/components/shared/layout/sidebar/SidebarButtons/AdminNavigation';
import ManagementButtonsNavigation from '@/components/shared/layout/sidebar/SidebarButtons/ManagementButtonsNavigation';
import {
  budgetButton,
  buildAdminNavigationButtons,
  manageNavigation,
  primaryNavigation,
} from '@/components/shared/layout/sidebar/SidebarButtons/sidebarButtonUtils';
import SidebarNavigationButton from '@/components/shared/layout/sidebar/SidebarButtons/SidebarNavigationButton';
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
    ...(showManageItems ? manageNavigation : []),
    ...adminNavigation,
  ];

  const activeRouteIndex = routeRows.findIndex(button => location.pathname === button.route);
  const activeIndex = expanded && activeRouteIndex >= 3 ? activeRouteIndex + 1 : activeRouteIndex;

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        sx={{
          position: 'absolute',
          left: '8px',
          right: '8px',
          height: '44px',
          borderRadius: '12px',
          backgroundColor: 'action.selected',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateY(${activeIndex * 52 + 12}px)`,
          zIndex: 0,
          opacity: activeIndex >= 0 ? 1 : 0,
          pointerEvents: 'none',
        }}
      />

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
