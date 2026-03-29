import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import SavingsIcon from '@mui/icons-material/Savings';
import SmartToyIcon from '@mui/icons-material/SmartToy';

import { SidebarButtonConfig } from '@/components/shared/layout/sidebar/SidebarButtons/SidebarNavigationButton';
import { ROUTES } from '@/constants/Routes';

export const primaryNavigation: SidebarButtonConfig[] = [
  { titleKey: 'overview', icon: DashboardIcon, route: ROUTES.OVERVIEW_URL },
  { titleKey: 'transactions', icon: RequestQuoteIcon, route: ROUTES.TRANSACTIONS_URL },
];

export const budgetButton: SidebarButtonConfig = {
  titleKey: 'budgets',
  icon: SavingsIcon,
  route: ROUTES.BUDGETS_URL,
};

export const manageNavigation: SidebarButtonConfig[] = [
  { titleKey: 'accounts', icon: AccountBalanceWalletIcon, route: ROUTES.ACCOUNTS_URL },
  { titleKey: 'categories', icon: CategoryIcon, route: ROUTES.CATEGORIES_URL },
  { titleKey: 'paymentMethods', icon: CreditCardIcon, route: ROUTES.PAYMENT_METHODS_URL },
];

export const buildAdminNavigationButtons = (isAdminUser: boolean): SidebarButtonConfig[] => {
  if (!isAdminUser) {
    return [];
  }

  return [
    {
      titleKey: 'chat',
      icon: SmartToyIcon,
      route: ROUTES.CHAT_URL,
      badge: 'NEW',
    },
    {
      titleKey: 'admin',
      icon: AdminPanelSettingsIcon,
      route: ROUTES.ADMIN_KPIS_URL,
    },
  ];
};
