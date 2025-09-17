import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  IconButton,
  Switch,
  useTheme,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useLocation, useNavigate } from 'react-router-dom';
import Row from '@/components/Layout/Row';
import { APP_ROUTES } from '@/constants/APP_ROUTES';
import CategoryIcon from '@mui/icons-material/Category';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAppTheme } from '@/providers/AppThemeProvider';

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

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleColorMode } = useAppTheme();
  const theme = useTheme();

  return (
    <Drawer
      sx={{
        width: '255px',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '255px',
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Row alignItems={'center'} spacing={2} padding={2}>
        <img src="../../../assets/finsightIcon.png" alt="App Logo" width={50} height={50} />
        <Typography variant={'h5'} fontWeight={700}>
          FinSight
        </Typography>
      </Row>
      <Divider />
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
      <Divider />

      <Row padding={2}>
        <IconButton color="inherit" onClick={toggleColorMode}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Switch
          checked={theme.palette.mode === 'dark'}
          onChange={toggleColorMode}
          color="primary"
        />
      </Row>
    </Drawer>
  );
};

export default Sidebar;
