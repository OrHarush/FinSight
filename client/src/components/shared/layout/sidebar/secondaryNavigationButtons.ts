import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SavingsIcon from '@mui/icons-material/Savings';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ROUTES } from '@/constants/Routes';
import { SidebarButtonConfig } from '@/components/shared/layout/sidebar/SidebarNavigationButton';

const getAdminSecondaryNavigation = (): SidebarButtonConfig[] => [
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

export const buildSecondaryNavigationButtons = (isAdminUser: boolean): SidebarButtonConfig[] => {
  const baseButtons: SidebarButtonConfig[] = [
    {
      titleKey: 'budgets',
      icon: SavingsIcon,
      route: ROUTES.BUDGETS_URL,
    },
  ];

  if (!isAdminUser) {
    return baseButtons;
  }

  return [...baseButtons, ...getAdminSecondaryNavigation()];
};

