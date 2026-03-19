import { Typography, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import { useOpen } from '@/hooks/common/useOpen';
import SettingsModal from '@/components/features/users/SettingsModal';
import HelpModal from '@/components/features/users/HelpModal';

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  setAnchorEl: (anchorEl: HTMLElement | null) => void;
}

const UserMenu = ({ anchorEl, setAnchorEl }: UserMenuProps) => {
  const { t } = useTranslation(['sidebar', 'user']);
  const { user, logout } = useAuth();
  const [isSettingsOpen, openSettings, closeSettings] = useOpen();
  const [isHelpOpen, openHelp, closeHelp] = useOpen();

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
  };

  const handleOpenSettings = () => {
    handleCloseMenu();
    openSettings();
  };

  const handleOpenHelp = () => {
    handleCloseMenu();
    openHelp();
  };

  return (
    <>
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
            {t('settings.signedInAs', { defaultValue: 'Signed in as' })}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {user!.email}
          </Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleOpenSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          {t('settings.title')}
        </MenuItem>
        <MenuItem onClick={handleOpenHelp}>
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
      </Menu>

      {isSettingsOpen && (
        <SettingsModal isOpen={isSettingsOpen} closeDialog={closeSettings} />
      )}

      {isHelpOpen && (
        <HelpModal isOpen={isHelpOpen} closeDialog={closeHelp} />
      )}
    </>
  );
};

export default UserMenu;
