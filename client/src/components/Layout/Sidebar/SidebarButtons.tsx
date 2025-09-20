import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/Routes';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CategoryIcon from '@mui/icons-material/Category';
import PieChartIcon from '@mui/icons-material/PieChart';
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
    route: ROUTES.DASHBOARD_URL,
  },
  {
    title: 'Transactions',
    icon: RequestQuoteIcon,
    route: ROUTES.TRANSACTIONS_URL,
  },
  {
    title: 'Accounts',
    icon: AccountBalanceWalletIcon,
    route: ROUTES.ACCOUNTS_URL,
  },
  {
    title: 'Categories',
    icon: CategoryIcon,
    route: ROUTES.CATEGORIES_URL,
  },
  {
    title: 'Budget',
    icon: PieChartIcon,
    route: ROUTES.BUDGET_URL,
  },
  {
    title: 'Planner',
    icon: EventIcon,
    route: ROUTES.PLANNER_URL,
  },
  {
    title: 'Reports',
    icon: BarChartIcon,
    route: ROUTES.REPORTS_URL,
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
