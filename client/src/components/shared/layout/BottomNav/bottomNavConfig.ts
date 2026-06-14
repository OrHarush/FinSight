import { SvgIconComponent } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SavingsIcon from '@mui/icons-material/Savings';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

import { ROUTES } from '@/constants/Routes';

export interface BottomNavItemConfig {
  titleKey: string;
  icon: SvgIconComponent;
  route: string;
}

export const bottomNavItems: BottomNavItemConfig[] = [
  { titleKey: 'overview', icon: DashboardIcon, route: ROUTES.OVERVIEW_URL },
  { titleKey: 'transactions', icon: RequestQuoteIcon, route: ROUTES.TRANSACTIONS_URL },
  { titleKey: 'budgets', icon: SavingsIcon, route: ROUTES.BUDGETS_URL },
  { titleKey: 'goals', icon: TrackChangesIcon, route: ROUTES.GOALS_URL },
];
