import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Collapse,
} from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/providers/AuthProvider';
import { isAdmin } from '@/utils/envUtils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SidebarNavigationButton, {
  SidebarButtonConfig,
} from '@/components/shared/layout/sidebar/SidebarNavigationButton';
import SidebarSecondaryNavigation from '@/components/shared/layout/sidebar/SidebarSecondaryNavigation';
import { buildSecondaryNavigationButtons } from '@/components/shared/layout/sidebar/secondaryNavigationButtons';

const SidebarButtons = () => {
  const { t } = useTranslation('sidebar');
  const location = useLocation();
  const { user } = useAuth();
  const [isManageExpanded, setIsManageExpanded] = useState(false);

  const manageNavigation: SidebarButtonConfig[] = [
    {
      titleKey: 'accounts',
      icon: AccountBalanceWalletIcon,
      route: ROUTES.ACCOUNTS_URL,
    },
    {
      titleKey: 'categories',
      icon: CategoryIcon,
      route: ROUTES.CATEGORIES_URL,
    },
    {
      titleKey: 'paymentMethods',
      icon: CreditCardIcon,
      route: ROUTES.PAYMENT_METHODS_URL,
    },
  ];

  const primaryNavigation: SidebarButtonConfig[] = [
    {
      titleKey: 'overview',
      icon: DashboardIcon,
      route: ROUTES.OVERVIEW_URL,
    },
    {
      titleKey: 'transactions',
      icon: RequestQuoteIcon,
      route: ROUTES.TRANSACTIONS_URL,
    },
  ];

  const secondaryNavigation = buildSecondaryNavigationButtons(isAdmin(user));

  const routeRows = [
    ...primaryNavigation,
    ...(isManageExpanded ? manageNavigation : []),
    ...secondaryNavigation,
  ];

  const activeRouteIndex = routeRows.findIndex(button => location.pathname === button.route);
  const activeIndex = activeRouteIndex >= 2 ? activeRouteIndex + 1 : activeRouteIndex;

  const isManageRouteActive = manageNavigation.some(button => location.pathname === button.route);

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
        <ListItem sx={{ padding: '4px 8px' }}>
          <ListItemButton
            onClick={() => setIsManageExpanded(prev => !prev)}
            sx={{
              borderRadius: '12px',
              height: '44px',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              color: isManageRouteActive ? 'primary.main' : 'inherit',
              transition: 'color 0.2s ease-in-out',
            }}
          >
            <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
              <ManageAccountsIcon color={isManageRouteActive ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary={t('manage')} />
            {isManageExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>
        <Collapse in={isManageExpanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {manageNavigation.map(button => (
              <SidebarNavigationButton
                key={button.titleKey}
                button={button}
                isActive={location.pathname === button.route}
                title={t(button.titleKey)}
                nested
              />
            ))}
          </List>
        </Collapse>
        <SidebarSecondaryNavigation
          secondaryNavigation={secondaryNavigation}
          currentPath={location.pathname}
        />
      </List>
    </Box>
  );
};

export default SidebarButtons;
