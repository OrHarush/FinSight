import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import { SvgIconComponent } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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
  // {
  //   titleKey: 'budget',
  //   icon: PieChartIcon,
  //   route: ROUTES.BUDGET_URL,
  // },
  // {
  //   titleKey: 'planner',
  //   icon: EventIcon,
  //   route: ROUTES.PLANNER_URL,
  // },
  // {
  //   titleKey: 'reports',
  //   icon: BarChartIcon,
  //   route: ROUTES.REPORTS_URL,
  // },
];

const SidebarButtons = () => {
  const { t } = useTranslation('sidebar');
  const navigate = useNavigate();

  return (
    <List>
      {SIDEBAR_NAVIGATION.map(button => {
        const Icon = button.icon;
        const isActive = location.pathname === button.route;

        return (
          <ListItem key={button.titleKey} sx={{ padding: '4px 8px' }}>
            <ListItemButton
              selected={isActive}
              onClick={() => navigate(button.route)}
              sx={{ borderRadius: '12px', height: '44px' }}
            >
              <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
                <Icon color={isActive ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary={t(button.titleKey)} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SidebarButtons;
