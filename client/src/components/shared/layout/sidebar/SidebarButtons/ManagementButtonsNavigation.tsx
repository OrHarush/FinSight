import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import SidebarNavigationButton, {
  SidebarButtonConfig,
} from '@/components/shared/layout/sidebar/SidebarButtons/SidebarNavigationButton';
import { useSidebar } from '@/components/shared/layout/sidebar/SidebarContext';

interface ManageNavigationProps {
  manageNavigation: SidebarButtonConfig[];
  isManageExpanded: boolean;
  onToggle: () => void;
}

const ManagementButtonsNavigation = ({
  manageNavigation,
  isManageExpanded,
  onToggle,
}: ManageNavigationProps) => {
  const { t } = useTranslation('sidebar');
  const location = useLocation();
  const { expanded } = useSidebar();

  const currentPath = location.pathname;

  const isManageRouteActive = manageNavigation.some(button => currentPath === button.route);
  const showManageItems = isManageExpanded || !expanded;

  return (
    <>
      {expanded && (
        <ListItem sx={{ padding: '4px 8px' }}>
          <ListItemButton
            onClick={onToggle}
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
      )}
      <Collapse in={showManageItems} timeout="auto" unmountOnExit>
        <List disablePadding>
          {manageNavigation.map(button => (
            <SidebarNavigationButton
              key={button.titleKey}
              button={button}
              isActive={currentPath === button.route}
              title={t(button.titleKey)}
              nested
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default ManagementButtonsNavigation;
