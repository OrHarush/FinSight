import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useLocation, useNavigate } from 'react-router-dom';
import Row from '@/components/Layout/Row';

interface SidebarButtonProps {
  title: string;
  icon: SvgIconComponent;
  route: string;
}

const SIDEBAR_NAVIGATION: SidebarButtonProps[] = [
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    route: '/dashboard',
  },
  {
    title: 'Transactions',
    icon: RequestQuoteIcon,
    route: '/transactions',
  },
  {
    title: 'Planner',
    icon: EventIcon,
    route: '/planner',
  },
  {
    title: 'Reports',
    icon: BarChartIcon,
    route: '/reports',
  },
  {
    title: 'Accounts',
    icon: AccountBalanceWalletIcon,
    route: '/accounts',
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

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
        <img src="../../../assets/finsightIcon.png" alt="App Logo" width={40} height={40} />
        <Typography>FinSight</Typography>
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
                <ListItemIcon sx={{ width: '24px' }}>
                  <Icon color={isActive ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={button.title} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
