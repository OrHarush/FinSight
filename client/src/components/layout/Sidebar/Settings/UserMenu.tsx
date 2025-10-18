import { Typography, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/Routes';
import { useNavigate } from 'react-router-dom';

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
}

const UserMenu = ({ anchorEl, setAnchorEl }: UserMenuProps) => {
  const { t } = useTranslation('common');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    navigate(ROUTES.LOGIN_URL);
  };

  const handleDeleteAccount = () => {};

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            overflow: 'visible',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        },
      }}
    >
      <MenuItem disabled sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography variant="body2" color="text.secondary">
          {t('general.signedInAs', { defaultValue: 'Signed in as' })}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {user!.email}
        </Typography>
      </MenuItem>
      <Divider sx={{ my: 1 }} />
      <MenuItem onClick={handleCloseMenu}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        {t('settings.title')}
      </MenuItem>
      <MenuItem onClick={handleCloseMenu}>
        <ListItemIcon>
          <HelpOutlineIcon fontSize="small" />
        </ListItemIcon>
        {t('settings.help')}
      </MenuItem>
      <Divider sx={{ my: 1 }} />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        {t('actions.logout')}
      </MenuItem>
      <MenuItem onClick={handleDeleteAccount} sx={{ color: 'error.main' }}>
        <ListItemIcon>
          <DeleteOutlineIcon color="error" fontSize="small" />
        </ListItemIcon>
        {t('settings.deleteAccount')}
      </MenuItem>
    </Menu>
  );
};

export default UserMenu;
