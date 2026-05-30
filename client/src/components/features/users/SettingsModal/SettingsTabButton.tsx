import { SvgIconComponent } from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

interface SettingsTabButtonProps {
  icon: SvgIconComponent;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SettingsTabButton = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: SettingsTabButtonProps) => (
  <ListItem sx={{ padding: '4px 8px' }}>
    <ListItemButton
      onClick={onClick}
      sx={{
        borderRadius: '12px',
        height: '44px',
        backgroundColor: 'transparent',
        transition: 'color 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: isActive ? 'transparent' : 'action.hover',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 24, mr: 1 }}>
        <Icon color={isActive ? 'primary' : 'inherit'} />
      </ListItemIcon>
      <ListItemText
        primary={label}
        sx={{
          color: isActive ? 'primary.main' : 'inherit',
          transition: 'color 0.2s ease-in-out',
        }}
      />
    </ListItemButton>
  </ListItem>
);

export default SettingsTabButton;
