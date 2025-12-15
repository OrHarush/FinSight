import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { SvgIconComponent } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

interface SidebarButtonProps {
  titleKey: string;
  icon: SvgIconComponent;
  route: string;
}

const SIDEBAR_NAVIGATION: SidebarButtonProps[] = [
  {
    titleKey: 'dashboard',
    icon: DashboardIcon,
    route: ROUTES.DASHBOARD_URL,
  },
  {
    titleKey: 'transactions',
    icon: RequestQuoteIcon,
    route: ROUTES.TRANSACTIONS_URL,
  },
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
  // {
  //   titleKey: 'budget',
  //   icon: PieChartIcon,
  //   route: ROUTES.BUDGET_URL,
  // },
];

const SidebarButtons = () => {
  const { t } = useTranslation('sidebar');
  const navigate = useNavigate();
  const location = useLocation();

  const activeIndex = useMemo(
    () => SIDEBAR_NAVIGATION.findIndex(button => location.pathname === button.route),
    [location.pathname]
  );

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
        {SIDEBAR_NAVIGATION.map((button, index) => {
          const Icon = button.icon;
          const isActive = index === activeIndex;

          return (
            <ListItem key={button.titleKey} sx={{ padding: '4px 8px' }}>
              <ListItemButton
                onClick={() => navigate(button.route)}
                sx={{
                  borderRadius: '12px',
                  height: '44px',
                  backgroundColor: 'transparent',
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: isActive ? 'transparent' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
                  <Icon color={isActive ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText
                  primary={t(button.titleKey)}
                  sx={{
                    color: isActive ? 'primary.main' : 'inherit',
                    transition: 'color 0.2s ease-in-out',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default SidebarButtons;
