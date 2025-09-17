import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/constants/APP_ROUTES';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import { SvgIconComponent } from '@mui/icons-material';

interface SidebarButtonProps {
  title: string;
  icon: SvgIconComponent;
  route: string;
}

const SIDEBAR_NAVIGATION: SidebarButtonProps[] = [
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    route: APP_ROUTES.DASHBOARD_URL,
  },
  {
    title: 'Transactions',
    icon: RequestQuoteIcon,
    route: APP_ROUTES.TRANSACTIONS_URL,
  },
  {
    title: 'Accounts',
    icon: AccountBalanceWalletIcon,
    route: APP_ROUTES.ACCOUNTS_URL,
  },
  {
    title: 'Categories',
    icon: CategoryIcon,
    route: APP_ROUTES.CATEGORIES_URL,
  },
  {
    title: 'Planner',
    icon: EventIcon,
    route: APP_ROUTES.PLANNER_URL,
  },
  {
    title: 'Reports',
    icon: BarChartIcon,
    route: APP_ROUTES.REPORTS_URL,
  },
];

const SidebarButtons = () => {
  const navigate = useNavigate();

  return (
    <List>
      {SIDEBAR_NAVIGATION.map(button => {
        const Icon = button.icon;
        const isActive = location.pathname === button.route;

        return (
          <ListItem key={button.title}>
            <ListItemButton
              selected={isActive}
              onClick={() => navigate(button.route)}
              sx={{ borderRadius: '16px', padding: 2, height: '36px' }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 24,
                  mr: 1,
                }}
              >
                <Icon color={isActive ? 'primary' : 'inherit'} />
              </ListItemIcon>
              <ListItemText primary={button.title} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SidebarButtons;
