import { Box, Chip, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export interface SidebarButtonConfig {
  titleKey: string;
  icon: SvgIconComponent;
  route: string;
  badge?: string;
}

interface SidebarNavigationButtonProps {
  button: SidebarButtonConfig;
  isActive: boolean;
  title: string;
  nested?: boolean;
}

const SidebarNavigationButton = ({
  button,
  isActive,
  title,
  nested = false,
}: SidebarNavigationButtonProps) => {
  const navigate = useNavigate();
  const Icon = button.icon;

  return (
    <ListItem sx={{ padding: '4px 8px' }}>
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pl: nested ? 4 : undefined,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
          <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
            <Icon color={isActive ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText
            primary={title}
            sx={{
              color: isActive ? 'primary.main' : 'inherit',
              transition: 'color 0.2s ease-in-out',
            }}
          />
        </Box>
        {button.badge && (
          <Chip
            label={button.badge}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 500,
              ml: 1,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
};

export default SidebarNavigationButton;
